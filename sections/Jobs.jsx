import jobStyles from "../styles/jobs.module.css";
import utilityStyles from "../styles/utilities.module.css";
import JobCard from "../components/JobCard";
import { MdCancel, MdSettingsSuggest } from "react-icons/md";
import { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { formatLink, convertToDate } from "../lib/format";
import { companies } from "../FakeDb/companies.json";
import { isAfter, isBefore } from "date-fns";
import Link from "next/link";
import jobCardStyles from "../styles/jobCardStyles.module.css";
import CustomSelect from "../components/CustomSelect";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobsToDisplay, setJobsToDisplay] = useState([]);
  const [filters, setFilters] = useState([]);
  const [searchIsOn, setSearchIsOn] = useState(false);
  const [salaryFilterIsOn, setSalaryFilterIsOn] = useState(false);
  const [locationFilterIsOn, setLocationFilterIsOn] = useState(false);
  const [jobTypeFilterIsOn, setJobTypeFilterIsOn] = useState(false);
  const [benefitsFilterIsOn, setBenefitsFilterIsOn] = useState(false);
  const [salarySilderIsActive, setSalarySliderIsActive] = useState(false);
  const [sortFilterIsOn, setSortFilterIsOn] = useState(false);
  const [latestSortIsOn, setLatestSortIsOn] = useState(false);
  const [benefitSortIsOn, setBenefitSortIsOn] = useState(false);
  const [salarySortIsOn, setSalarySortIsOn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [test, setTest] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showJobTypes, setShowJobTypes] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showSorts, setShowSorts] = useState(false);

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

  const filterJobs = (e) => {
    let filterValue = e.target.innerText;

    switch (e.target.parentElement.parentElement.id) {
      case "benefits":
        //e.target.innerText = "🪅Benefits";
        if (filterValue !== "🪅Benefits") {
          setBenefitsFilterIsOn(true);
          setShowBenefits(false);
          if (!filters.includes(filterValue)) {
            setFilters((prevFilters) => [...prevFilters, filterValue]);
          }
        }
        break;
      case "location":
        //e.target.innerText = "📍Location";
        if (filterValue !== "📍Location") {
          setLocationFilterIsOn(true);
          setShowLocations(false);
          if (!filters.includes(filterValue)) {
            setFilters((prevFilters) => [...prevFilters, filterValue]);
          }
        }
        break;
      case "jobType":
        //e.target.innerText = "💼Job type";
        if (filterValue !== "💼Job type") {
          setJobTypeFilterIsOn(true);
          setShowJobTypes(false);
          if (!filters.includes(filterValue)) {
            setFilters((prevFilters) => [...prevFilters, filterValue]);
          }
        }
        break;
      case "sortJobs":
        //e.target.innerText = "🔬Sort by";
        if (filterValue !== "🔬Sort by") {
          setSortFilterIsOn(true);
          setShowSorts(false);
          if (!filters.includes(filterValue)) {
            setFilters((prevFilters) => [...prevFilters, filterValue]);
          }

          switch (filterValue) {
            case "🍰Most benefits":
              setBenefitSortIsOn(true);
              break;
            case "💰Highest salary":
              setSalarySortIsOn(true);

              break;
            case "⌚Latest":
              setLatestSortIsOn(true);
              break;
          }
        }
    }
  };

  const removeFilter = (e) => {
    let value = e.currentTarget.parentElement.parentElement.innerText;

    let result = filters.filter((element) => element !== value);
    if (!result.length) {
      setJobsToDisplay(jobs);
    }
    setFilters(result);
  };

  const displayDropDown = (e) => {
    let value = e.currentTarget.parentElement.parentElement.id;

    if (value.includes("salary")) {
      setSalaryFilterIsOn(true);
    }

    switch (value) {
      case "benefits":
        setShowBenefits(true);
        break;
      case "jobType":
        setShowJobTypes(true);
        break;
      case "location":
        setShowLocations(true);
        break;
      case "sortJobs":
        setShowSorts(true);
        break;
    }
  };

  const hideDropDown = (e) => {
    let value = e.currentTarget.parentElement.parentElement.id;
    console.log(value);
    if (value.includes("salary")) {
      setSalaryFilterIsOn(false);
    }
    switch (value) {
      case "benefits":
        setShowBenefits(false);
        break;
      case "jobType":
        setShowJobTypes(false);
        break;
      case "location":
        setShowLocations(false);
        break;
      case "sortJobs":
        setShowSorts(false);
        break;
    }
  };

  const handleSliderChange = (e) => {
    let value = e.target.value;
    let editedValue = e.target.value;

    if (value.length > 3) {
      editedValue = e.target.value.substring(0, 3);
    }
    document.querySelector("#salary-value").innerText = `R${editedValue}k/year`;
  };

  const searchWithFilters = (arrayToSearch) => {
    let salaryInput = document.querySelector("#salary-slider");

    let salaryValue = 0;
    if (salaryInput) {
      salaryValue = salaryInput.value;
    }

    let results = [];
    arrayToSearch.forEach((job, idx) => {
      let isBenefitsValid = false;
      let isSalaryValid = false;
      let jobTypeIsValid = false;
      let locationIsValid = false;

      if (!benefitsFilterIsOn) {
        isBenefitsValid = true;
      }

      if (!salaryFilterIsOn) {
        isSalaryValid = true;
      }

      if (!locationFilterIsOn) {
        locationIsValid = true;
      }

      if (!jobTypeFilterIsOn) {
        jobTypeIsValid = true;
      }

      if (job.benefits.some((attribute) => filters.includes(attribute))) {
        isBenefitsValid = true;
      }

      if (filters.includes(job.jobType)) {
        jobTypeIsValid = true;
      }

      if (Number.parseInt(job.salary) >= Number.parseInt(salaryValue)) {
        isSalaryValid = true;
      }

      if (filters.includes(job.location.split(", ")[1])) {
        locationIsValid = true;
      }

      if (
        isBenefitsValid &&
        isSalaryValid &&
        locationIsValid &&
        jobTypeIsValid
      ) {
        results.push(job);
      }
    });
    if (benefitSortIsOn) {
      for (let i = 0; i < results.length; i++) {
        for (let j = i; j < results.length; j++) {
          if (results[j].benefits.length > results[i].benefits.length) {
            let temp = results[j];
            results[j] = results[i];
            results[i] = temp;
          }
        }
      }
      setBenefitSortIsOn(false);
    } else if (salarySortIsOn) {
      for (let i = 0; i < results.length; i++) {
        for (let j = i; j < results.length; j++) {
          if (
            Number.parseInt(results[j].salary) >
            Number.parseInt(results[i].salary)
          ) {
            let temp = results[j];
            results[j] = results[i];
            results[i] = temp;
          }
        }
      }
      setSalarySortIsOn(false);
    } else if (latestSortIsOn) {
      for (let i = 0; i < results.length; i++) {
        for (let j = i; j < results.length; j++) {
          if (
            isAfter(
              convertToDate(results[j].datePosted),
              convertToDate(results[i].datePosted)
            )
          ) {
            let temp = results[j];
            results[j] = results[i];
            results[i] = temp;
          }
        }
      }
      setLatestSortIsOn(false);
    }
    setJobsToDisplay(results);
  };

  useEffect(() => {
    // setJobsToDisplay(companies);
    // setJobs(companies);
    // setLoading(false);
    const colRef = collection(db, "jobs");
    getDocs(colRef).then((snapshot) => {
      let jobss = [];
      snapshot.docs.forEach((doc, idx) => {
        jobss.push({ ...doc.data() });
      });

      setJobs(jobss);
      setJobsToDisplay(jobss);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (filters.length) {
      if (searchIsOn) {
        searchWithFilters(jobsToDisplay);
      } else {
        searchWithFilters(jobs);
      }
    }
  }, [filters]);

  return (
    <section className={jobStyles.container} id="jobs">
      <div
        style={{ display: "flex" }}
        className={`${jobStyles.searchContainer}`}
      >
        <span onClick={searchJob}>🔍</span>
        <input
          type="text"
          id="searchBar"
          className={`${jobStyles.search} ${utilityStyles.roundOut}`}
          placeholder="Enter job title"
          onChange={handleChange}
        />
      </div>

      <div className={jobStyles.filtersContainer}>
        <CustomSelect
          name="benefits"
          title="🪅Benefits"
          stateTracker={showBenefits}
          setStateTracker={setShowBenefits}
          options={[
            "📜Degree not required",
            "⚖️Work/life balance",
            "🏋️Gym membership",
            "📖Learning budget",
            "🤼Pair programs",
            "🌈Diverse team",
          ]}
          onChangeHandler={filterJobs}
        />
        <CustomSelect
          onChangeHandler={filterJobs}
          name="jobType"
          title="💼Job type"
          stateTracker={showJobTypes}
          setStateTracker={setShowJobTypes}
          options={["🕛Full-time", "🕧Part-time", "⌚Internship"]}
        />

        <div id="salary">
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
        </div>
        <CustomSelect
          onChangeHandler={filterJobs}
          name="location"
          title="📍Location"
          stateTracker={showLocations}
          setStateTracker={setShowLocations}
          options={[
            "Gauteng",
            "Western Cape",
            "KwaZulu-Natal",
            "Northern Cape",
            "Free State",
            "Eastern Cape",
            "North West",
            "Mpumalanga",
            "Limpopo",
          ]}
        />
        <CustomSelect
          onChangeHandler={filterJobs}
          name="sortJobs"
          title="🔬Sort by"
          stateTracker={showSorts}
          setStateTracker={setShowSorts}
          options={["⌚Latest", "🍰Most benefits", "💰Highest salary"]}
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
            return (
              <Link
                href={`/jobs/${job.jobId}`}
                className={jobCardStyles.link}
                key={`jobCard${idx}`}
              >
                <JobCard
                  companyName={job.companyName}
                  companyLogo={job.companyLogo}
                  position={job.position}
                  location={job.location}
                  salary={job.salary}
                  datePosted={job.datePosted}
                  benefits={job.benefits}
                  jobType={job.jobType}
                  companyEmail={job.companyEmail}
                  invoiceEmail={job.invoicEmail}
                  background={job.background}
                  hasCustomBackground={job.hasCustomBackground}
                  applicationEmail={job.applicationEmail}
                  applitcationURL={job.applicationURL}
                  description={job.description}
                  salaryIsNegotiable={job.salaryIsNegotiable}
                  jobId={job.jobId}
                />
              </Link>
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
