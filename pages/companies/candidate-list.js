import jobStyles from "../../styles/jobs.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import CustomSelect from "../../components/CustomSelect";
import CandidateCard from "../../components/CandidateCard";
import CustomSearch from "../../components/CustomSearch";
import CustomCheckBox from "../../components/CustomCheckBox";
import {
  benefits,
  jobTypes,
  durations,
  salaryTypes,
  schoolYears,
  sexes,
  visaStatusses,
} from "../../lib/filterOptions.json";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const CompanyCandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [candidatesToDisplay, setCandidatesToDisplay] = useState([]);
  const [filters, setFilters] = useState([]);
  const [searchIsOn, setSearchIsOn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [skillsList, setSkillsList] = useState([]);
  const [visaList, setVisaList] = useState([]);
  const [sexList, setSexList] = useState([]);
  const [degreeList, setDegreeList] = useState([]);
  const [institutionList, setInstitutionList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [schoolYearList, setSchoolYearList] = useState([]);
  const [projectFilterIsOn, setProjectFilterIsOn] = useState(false);
  const [portfolioFilterIsOn, setPortfolioFilterIsOn] = useState(false);
  const [jobTypeList, setJobTypeList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [sortList, setSortList] = useState([]);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const searchJob = () => {
    let searchValue = document.querySelector("#searchBar").value;
    let results = [];
    if (filters.length) {
      candidatesToDisplay.forEach((candidate) => {
        if (candidate.name.toLowerCase().includes(searchValue.toLowerCase())) {
          results.push(candidate);
        }
      });
    } else {
      candidates.forEach((candidate) => {
        if (candidate.name.toLowerCase().includes(searchValue.toLowerCase())) {
          results.push(candidate);
        }
      });
    }

    setCandidatesToDisplay(results);
  };

  const clearSearch = () => {
    document.querySelector("#searchBar").value = "";
    if (!filters.length) {
      setCandidatesToDisplay(candidates);
    } else {
      searchWithFilters(candidates);
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

    removeFilterFromList(skillsList, filterToRemove, setSkillsList);
    removeFilterFromList(degreeList, filterToRemove, setDegreeList);
    removeFilterFromList(institutionList, filterToRemove, setInstitutionList);
    removeFilterFromList(roleList, filterToRemove, setRoleList);
    removeFilterFromList(sexList, filterToRemove, setSexList);
    removeFilterFromList(visaList, filterToRemove, setVisaList);
    removeFilterFromList(schoolYearList, filterToRemove, setSchoolYearList);
    if (filterToRemove == "🧪Has projects") {
      setProjectFilterIsOn(false);
    }
    if (filterToRemove == "🔗Has portfolio") {
      setPortfolioFilterIsOn(false);
    }
    removeFilterFromList(jobTypeList, filterToRemove, setJobTypeList);
    removeFilterFromList(locationList, filterToRemove, setLocationList);
    removeFilterFromList(sortList, filterToRemove, setSortList);

    if (!result.length) {
      setCandidatesToDisplay(candidates);
    }
    setFilters(result);
  };

  const searchWithFilters = (arrayToSearch) => {
    let result = [];
    let skillsIsValid = true,
      degreeIsValid = true,
      institutionIsValid = true,
      roleIsValid = true,
      schoolYearIsValid = true,
      projectIsValid = true,
      sexIsValid = true,
      visaIsValid = true,
      portfolioIsValid = true,
      jobTypeIsValid = true,
      locationIsValid = true;

    arrayToSearch.forEach((candidate) => {
      if (skillsList.length) {
        skillsIsValid = candidate.skills.some((skill) =>
          filters.includes(skill)
        );
      }

      if (degreeList.length) {
        degreeIsValid = filters.some(
          (filter) =>
            filter.toLowerCase() == candidate.education[0].major.toLowerCase()
        );
      }

      if (institutionList.length) {
        institutionIsValid = filters.some(
          (filter) =>
            filter.toLowerCase() ==
            candidate.education[0].institution.toLowerCase()
        );
      }

      if (roleList.length) {
        roleIsValid = candidate.roles.some((role) =>
          filters.includes(role.toUpperCase())
        );
      }

      if (sexList.length) {
        sexIsValid = candidate.sex === sexList[0];
      }

      if (visaList.length) {
        visaIsValid = candidate.visaStatus === visaList[0];
      }

      if (schoolYearList.length) {
        schoolYearIsValid = filters.includes(candidate.schoolYear);
      }

      if (projectFilterIsOn) {
        projectIsValid = candidate.projects.length > 0;
      }

      if (portfolioFilterIsOn) {
        portfolioIsValid = candidate.hasPortfolio;
      }

      if (jobTypeList.length) {
        jobTypeIsValid = filters.includes(candidate.jobType);
      }

      if (locationList.length) {
        locationIsValid = filters.includes(candidate.location.split(", ")[1]);
      }

      if (
        skillsIsValid &&
        degreeIsValid &&
        institutionIsValid &&
        schoolYearIsValid &&
        projectIsValid &&
        portfolioIsValid &&
        jobTypeIsValid &&
        locationIsValid &&
        roleIsValid &&
        sexIsValid &&
        visaIsValid
      ) {
        result.push(candidate);
      }
    });

    sortList.forEach((element) => {
      switch (element) {
        case "🎪Most skills":
          for (let i = 0; i < result.length; i++) {
            for (let j = i; j < result.length; j++) {
              if (result[j].skills.length > result[i].skills.length) {
                let temp = result[j];
                result[j] = result[i];
                result[i] = temp;
              }
            }
          }
          break;
        case "🧑‍🔬Most projects":
          for (let i = 0; i < result.length; i++) {
            for (let j = i; j < result.length; j++) {
              if (result[j].projects.length > result[i].projects.length) {
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
    setCandidatesToDisplay(result);
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

  const addFilterInput = (e) => {
    const source = e.currentTarget.id.split("-")[1];
    const filterToAdd = document
      .querySelector(`#${source}`)
      .value.toUpperCase();
    if (checkFilterIsValid(filterToAdd)) {
      setFilters([...filters, filterToAdd]);
      document.querySelector(`#${source}`).value = "";

      switch (source) {
        case "skills":
          setSkillsList([...skillsList, filterToAdd]);
          break;
        case "degree":
          setDegreeList([...degreeList, filterToAdd]);
          break;
        case "institution":
          setInstitutionList([...institutionList, filterToAdd]);
          break;
        case "role":
          setRoleList([...roleList, filterToAdd]);
          break;
      }
    }
  };

  const addFilterSelect = (e) => {
    const source = e.target.parentElement.parentElement.id;
    const filterToAdd = e.target.innerText;

    if (checkFilterIsValid(filterToAdd)) {
      switch (source) {
        case "schoolYear":
          setFilters([...filters, filterToAdd]);
          setSchoolYearList([...schoolYearList, filterToAdd]);
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
        case "sex":
          let newSexFilters = filters.filter(
            (filter) => filter !== "♂️Male" && filter !== "♀️Female"
          );
          newSexFilters.push(filterToAdd);
          setFilters(newSexFilters);
          setSexList([filterToAdd]);
          break;
        case "visaStatus":
          let newVisaFilters = filters.filter(
            (filter) =>
              filter !== "Eligible to work in S.A" &&
              filter !== "Will require a sponshorship"
          );
          newVisaFilters.push(filterToAdd);
          setFilters(newVisaFilters);
          setVisaList([filterToAdd]);
          break;
      }
    }
  };

  const addFilterCheckbox = (e) => {
    const source = e.target.id;
    switch (source) {
      case "projects":
        if (e.target.checked) {
          setFilters([...filters, "🧪Has projects"]);
          setProjectFilterIsOn((prevState) => (prevState = true));
        } else {
          let newFilters = filters.filter(
            (filter) => filter !== "🧪Has projects"
          );
          setFilters(newFilters);
          setProjectFilterIsOn((prevState) => (prevState = false));
        }

        break;
      case "portfolio":
        if (e.target.checked) {
          setFilters([...filters, "🔗Has portfolio"]);
        } else {
          let newFilters = filters.filter(
            (filter) => filter !== "🔗Has portfolio"
          );
          setFilters(newFilters);
        }
        break;
    }
  };

  useEffect(() => {
    getDocs(collection(db, "candidates")).then((res) => {
      let candidates = [];
      res.docs.forEach((doc) => {
        candidates.push({ ...doc.data() });
      });

      setCandidates(candidates);
      setCandidatesToDisplay(candidates);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchIsOn && !filters.length) {
      searchJob();
    } else if (searchIsOn) {
      searchWithFilters(candidatesToDisplay);
    } else {
      searchWithFilters(candidates);
    }
  }, [filters]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    }
  }, [loading, user]);

  return (
    <section className={jobStyles.container} id="candidates">
      <div
        style={{ display: "flex" }}
        className={`${jobStyles.searchContainer}`}
      >
        <span onClick={searchJob}>🔍</span>
        <input
          type="text"
          id="searchBar"
          className={utilityStyles.mergeInputWithDiv}
          placeholder="Enter a candidate's name"
          onChange={handleChange}
        />
      </div>
      <div className={jobStyles.filtersContainer}>
        <CustomSearch
          name="skills"
          emoji="🤹"
          method={addFilterInput}
          title="Enter skills"
        />
        <CustomSearch
          name="degree"
          emoji="📜"
          method={addFilterInput}
          title="Enter degree"
        />
        <CustomSearch
          name="institution"
          emoji="🏫"
          method={addFilterInput}
          title="Enter institution"
        />
        <CustomSearch
          name="role"
          emoji="🤩"
          method={addFilterInput}
          title="Enter role"
        />
        <CustomCheckBox
          name="projects"
          title="🧪Has projects"
          method={addFilterCheckbox}
        />
        <CustomCheckBox
          name="portfolio"
          title="🔗Has portfolio"
          method={addFilterCheckbox}
        />
        <CustomSelect
          name="schoolYear"
          title="🥚School Year"
          options={schoolYears}
          onChangeHandler={addFilterSelect}
        />

        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="jobType"
          title="💼Job type"
          options={jobTypes}
        />

        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="visaStatus"
          title="🌐 Visa status"
          options={visaStatusses}
        />
        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="sex"
          title="🚻Biological sex"
          options={sexes}
        />
        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="location"
          title="📍Location"
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
          onChangeHandler={addFilterSelect}
          name="sortJobs"
          title="🔬Sort by"
          options={[
            "🎪Most skills",
            "🧑‍🔬Most projects",
            // "📆Earliest graduation year",
          ]}
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
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <button
          onClick={() => router.push("/companies/bookmarked-candidates")}
          style={{ backgroundColor: "var(--color-1)" }}
        >
          View bookmarked candidates
        </button>
        <button
          onClick={() => router.push("/companies/prospective-candidates")}
          style={{ backgroundColor: "var(--color-1)" }}
        >
          View prospective candidates
        </button>
      </div>

      <div className={jobStyles.jobListContainer}>
        {candidatesToDisplay.length && !isLoading ? (
          candidatesToDisplay.map((candidate, idx) => {
            return (
              <Link
                href={`/companies/candidates/${candidate.candidateId}`}
                key={`candidate${idx}`}
              >
                <CandidateCard candidate={candidate} />
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

export default CompanyCandidateList;
