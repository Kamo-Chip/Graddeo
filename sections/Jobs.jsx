import jobStyles from "../styles/jobs.module.css";
import utilityStyles from "../styles/utilities.module.css";
import JobCard from "../components/JobCard";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import CustomSelect from "../components/CustomSelect";
import { useRouter } from "next/router";
import {
  benefits,
  jobTypes,
  locations,
  industries,
} from "../lib/filterOptions.json";
import { isAfter } from "date-fns";
import { convertToDate } from "../lib/format";

const Jobs = ({ isPreview }) => {
  const [jobs, setJobs] = useState([]);
  const [jobsToDisplay, setJobsToDisplay] = useState([]);
  const [filters, setFilters] = useState([]);
  const [searchIsOn, setSearchIsOn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [industryList, setIndustryList] = useState([]);
  const [benefitsList, setBenefitsList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [jobTypeList, setJobTypeList] = useState([]);
  const [sortList, setSortList] = useState([]);
  const router = useRouter();

  const searchJob = () => {
    let searchValue = document.querySelector("#searchBar").value;
    let results = [];
    if (filters.length) {
      jobsToDisplay.forEach((job) => {
        if (job.position.toLowerCase().includes(searchValue.toLowerCase())) {
          results.push(job);
        }
      });
    } else {
      jobs.forEach((job) => {
        if (job.position.toLowerCase().includes(searchValue.toLowerCase())) {
          results.push(job);
        }
      });
    }

    setJobsToDisplay(results);
  };

  const clearSearch = () => {
    document.querySelector("#searchBar").value = "";
    if (!filters.length) {
      setJobsToDisplay(jobs);
    } else {
      searchWithFilters(jobs);
    }
  };

  const handleChange = (e) => {
    setSearchIsOn(true);

    if (e.target.value === "") {
      setSearchIsOn(false);
      clearSearch();
      return;
    }

    searchJob();
  };

  const removeFilterFromList = (array, filterToRemove, updateList) => {
    if (array.includes(filterToRemove)) {
      let newList = array.filter((element) => element != filterToRemove);
      updateList([...newList]);
    }
  };

  const removeFilter = (e) => {
    let filterToRemove = e.currentTarget.parentElement.innerText;
    let result = filters.filter((filter) => filter !== filterToRemove);

    removeFilterFromList(jobTypeList, filterToRemove, setJobTypeList);
    removeFilterFromList(benefitsList, filterToRemove, setBenefitsList);
    removeFilterFromList(locationList, filterToRemove, setLocationList);
    removeFilterFromList(industryList, filterToRemove, setIndustryList);
    removeFilterFromList(sortList, filterToRemove, setSortList);

    if (!result.length) {
      setJobsToDisplay(jobs);
    }
    setFilters(result);
  };

  const searchWithFilters = (arrayToSearch) => {
    let result = [];
    let industryIsValid = true,
      jobTypeIsValid = true,
      benefitsIsValid = true,
      locationIsValid = true;

    arrayToSearch.forEach((job) => {
      if (jobTypeList.length) {
        jobTypeIsValid = jobTypeList.includes(job.jobType);
      }

      if (industryList.length) {
        industryIsValid = filters.includes(job.industry);
      }

      if (benefitsList.length) {
        benefitsIsValid = job.benefits.some((benefit) =>
          filters.includes(benefit)
        );
      }

      if (locationList.length) {
        locationIsValid = filters.includes(job.location.split(", ")[1]);
      }

      if (
        industryIsValid &&
        benefitsIsValid &&
        locationIsValid &&
        jobTypeIsValid
      ) {
        result.push(job);
      }
    });

    sortList.forEach((element) => {
      switch (element) {
        case "🎂 Most benefits":
          for (let i = 0; i < result.length; i++) {
            for (let j = i; j < result.length; j++) {
              if (result[j].benefits.length > result[i].benefits.length) {
                let temp = result[j];
                result[j] = result[i];
                result[i] = temp;
              }
            }
          }
          break;
        case "⌚ Latest":
          for (let i = 0; i < result.length; i++) {
            for (let j = i; j < result.length; j++) {
              if (
                isAfter(
                  convertToDate(result[j].datePosted),
                  convertToDate(result[i].datePosted)
                )
              ) {
                let temp = result[j];
                result[j] = result[i];
                result[i] = temp;
              }
            }
          }
          break;
        case "📆Earliest graduation year":
          for (let i = 0; i < result.length; i++) {
            for (let j = i; j < result.length; j++) {
              if (
                Number.parseInt(result[j].graduationYear) >
                Number.parseInt(result[i].graduationYear)
              ) {
                let temp = result[j];
                result[j] = result[i];
                result[i] = temp;
              }
            }
          }
          break;
      }
    });
    setJobsToDisplay(result);
  };

  const checkFilterIsValid = (filter) => {
    let isValid = true;
    if (filter == "") {
      isValid = false;
    }
    if (filters.includes(filter)) {
      isValid = false;
    }

    return isValid;
  };

  const addFilterSelect = (e) => {
    const source = e.target.parentElement.parentElement.id;
    const filterToAdd = e.target.innerText;

    if (checkFilterIsValid(filterToAdd)) {
      switch (source) {
        case "industry":
          setFilters([...filters, filterToAdd]);
          setIndustryList([...industryList, filterToAdd]);
          break;
        case "benefits":
          setFilters([...filters, filterToAdd]);
          setBenefitsList([...benefitsList, filterToAdd]);
          break;
        case "jobType":
          setFilters([...filters, filterToAdd]);
          setJobTypeList([...jobTypeList, filterToAdd]);
          break;
        case "location":
          setFilters([...filters, filterToAdd]);
          setLocationList([...locationList, filterToAdd]);
          break;
        case "sortJobs":
          setFilters([...filters, filterToAdd]);
          setSortList([...sortList, filterToAdd]);
          break;
      }
    }
  };

  useEffect(() => {
    getDocs(collection(db, "jobs")).then((res) => {
      let jobs = [];
      res.docs.forEach((doc) => {
        jobs.push({ ...doc.data() });
      });

      setJobs(jobs);
      setJobsToDisplay(jobs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchIsOn && !filters.length) {
      searchJob();
    } else if (searchIsOn) {
      searchWithFilters(jobsToDisplay);
    } else {
      searchWithFilters(jobs);
    }
  }, [filters]);

  return (
    <section className={jobStyles.container}>
      <div
        style={{ display: "flex" }}
        className={`${jobStyles.searchContainer}`}
      >
        <span onClick={searchJob}>🔍</span>
        <input
          type="text"
          id="searchBar"
          className={utilityStyles.mergeInputWithDiv}
          placeholder="Enter job title"
          onChange={handleChange}
        />
      </div>

      <div className={jobStyles.filtersContainer}>
        <CustomSelect
          name="industry"
          title="🏭 Industry"
          options={industries}
          onChangeHandler={addFilterSelect}
        />

        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="benefits"
          title="🍰 Benefits"
          options={benefits}
        />
        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="jobType"
          title="💼 Job type"
          options={jobTypes}
        />
        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="location"
          title="📍Location"
          options={locations}
        />
        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="sortJobs"
          title="🔬 Sort"
          options={["🎂 Most benefits", "⌚ Latest"]}
        />
      </div>
      <div className={jobStyles.filtersList}>
        {filters
          ? filters.map((filter, idx) => {
              return (
                <div key={`filter${idx}`} className={utilityStyles.roundOut}>
                  {filter}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: ".5em",
                    }}
                    onClick={removeFilter}
                  >
                    <MdCancel />
                  </span>
                </div>
              );
            })
          : null}
      </div>
      <div className={jobStyles.jobListContainer}>
        {jobsToDisplay.length && !isLoading ? (
          jobsToDisplay.map((job, idx) => {
            return !isPreview ? (
              <Link href={`/candidates/jobs/${job.jobId}`} key={`job${idx}`}>
                <JobCard job={job} />
              </Link>
            ) : (
              <span key={`job${idx}`} onClick={() => window.alert("sign up")}>
                <JobCard job={job} />
              </span>
            );
          })
        ) : isLoading ? (
          <div>Loading</div>
        ) : (
          <span>No results</span>
        )}
      </div>
    </section>
  );
};

export default Jobs;

{
  /* <div id="salary">
<div id="salary-filter" className={`${utilityStyles.filterOption}`}>
  <div>💵Salary</div>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={!salaryFilterIsOn ? displayDropDown : hideDropDown}
  >
    {!salaryFilterIsOn ? (
      <RiArrowDropDownLine size="1.75rem" />
    ) : (
      <RiArrowDropUpLine size="1.75rem" />
    )}
  </div>
</div>

{salaryFilterIsOn ? (
  <div className={utilityStyles.filterResults}>
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>Minimum</span>
      <span
        id="salary-value"
        style={{ border: "none", textAlign: "end" }}
      >
        R0k/year
      </span>
    </div>

    <input
      type="range"
      min={0}
      max={500000}
      step="100000"
      id="salary-slider"
      className={jobStyles.salarySilder}
      style={{ width: "100%" }}
      onMouseDown={() => setSalarySliderIsActive(true)}
      onMouseMove={(e) => {
        if (salarySilderIsActive) {
          {
            handleSliderChange(e);
          }
        }
      }}
      onMouseUp={() => {
        setSalarySliderIsActive(false);
        setSalaryFilterIsOn(false);
        let newFilters = [];

        filters.forEach((filter) => {
          if (!(filter.includes("R") && filter.includes("k"))) {
            newFilters.push(filter);
          }
        });

        newFilters.push(
          document.querySelector("#salary-value").innerText
        );

        setFilters(newFilters);
      }}
    />
  </div>
) : null}
</div> */
}
