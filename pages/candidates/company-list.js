import jobStyles from "../../styles/jobs.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import CustomSelect from "../../components/CustomSelect";
import CustomCheckBox from "../../components/CustomCheckBox";
import {
  benefits,
  industries,
  employeeCounts,
  locations,
} from "../../lib/filterOptions.json";
import { useRouter } from "next/router";
import CompanyCard from "../../components/CompanyCard";
import { useAuthState } from "react-firebase-hooks";

const CandidateCompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [companiesToDisplay, setCompaniesToDisplay] = useState([]);
  const [filters, setFilters] = useState([]);
  const [searchIsOn, setSearchIsOn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [industryList, setIndustryList] = useState([]);
  const [hiringNowFilterIsOn, setHiringNowFilterIsOn] = useState(false);
  const [benefitsList, setBenefitsList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [employeeCountList, setEmployeeCountList] = useState([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const searchJob = () => {
    let searchValue = document.querySelector("#searchBar").value;
    let results = [];
    if (filters.length) {
      companiesToDisplay.forEach((company) => {
        if (company.name.toLowerCase().includes(searchValue.toLowerCase())) {
          results.push(company);
        }
      });
    } else {
      companies.forEach((company) => {
        if (company.name.toLowerCase().includes(searchValue.toLowerCase())) {
          results.push(company);
        }
      });
    }

    setCompaniesToDisplay(results);
  };

  const clearSearch = () => {
    document.querySelector("#searchBar").value = "";
    if (!filters.length) {
      setCompaniesToDisplay(companies);
    } else {
      searchWithFilters(companies);
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

    removeFilterFromList(
      employeeCountList,
      filterToRemove,
      setEmployeeCountList
    );
    removeFilterFromList(industryList, filterToRemove, setIndustryList);
    if (filterToRemove == "👔 Hiring now") {
      setHiringNowFilterIsOn(false);
    }

    removeFilterFromList(benefitsList, filterToRemove, setBenefitsList);
    removeFilterFromList(locationList, filterToRemove, setLocationList);

    if (!result.length) {
      setCompaniesToDisplay(companies);
    }
    setFilters(result);
  };

  const searchWithFilters = (arrayToSearch) => {
    let result = [];
    let industryIsValid = true,
      employeeCountIsValid = true,
      benefitsIsValid = true,
      locationIsValid = true,
      hiringNowIsValid = true;

    arrayToSearch.forEach((company) => {
      if (employeeCountList.length) {
        employeeCountIsValid = employeeCountList.includes(
          company.employeeCount
        );
      }

      if (industryList.length) {
        industryIsValid = filters.includes(company.industry);
      }

      if (hiringNowFilterIsOn) {
        hiringNowIsValid = company.jobs.length > 0;
      }

      if (benefitsList.length) {
        benefitsIsValid = filters.includes(company.benefits);
      }

      if (locationList.length) {
        locationIsValid = filters.includes(company.location.split(", ")[1]);
      }

      if (
        industryIsValid &&
        hiringNowIsValid &&
        benefitsIsValid &&
        locationIsValid &&
        employeeCountIsValid
      ) {
        result.push(company);
      }
    });

    
    
    setCompaniesToDisplay(result);
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
        case "employeeCount":
          setFilters([...filters, filterToAdd]);
          setEmployeeCountList([...employeeCountList, filterToAdd]);
        case "location":
          setFilters([...filters, filterToAdd]);
          setLocationList([...locationList, filterToAdd]);
          break;
      }
    }
  };

  const addFilterCheckbox = (e) => {
    const source = e.target.id;
    switch (source) {
      case "hiringNow":
        if (e.target.checked) {
          setFilters([...filters, "👔 Hiring now"]);
          setHiringNowFilterIsOn((prevState) => (prevState = true));
        } else {
          let newFilters = filters.filter(
            (filter) => filter !== "👔 Hiring now"
          );
          setFilters(newFilters);
          setHiringNowFilterIsOn((prevState) => (prevState = false));
        }
        break;
    }
  };

  useEffect(() => {
    getDocs(collection(db, "companies")).then((res) => {
      let companies = [];
      res.docs.forEach((doc) => {
        companies.push({ ...doc.data() });
      });

      setCompanies(companies);
      setCompaniesToDisplay(companies);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchIsOn && !filters.length) {
      searchJob();
    } else if (searchIsOn) {
      searchWithFilters(companiesToDisplay);
    } else {
      searchWithFilters(companies);
    }
  }, [filters]);

  useState(() => {
    if (!loading && !user) {
      router.push("/candidates");
    }
  }, [loading, user]);

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
          className={`${jobStyles.search} ${utilityStyles.roundOut}`}
          placeholder="Enter a company's name"
          onChange={handleChange}
        />
      </div>

      <div className={jobStyles.filtersContainer}>
        <CustomCheckBox
          name="hiringNow"
          title="👔 Hiring now"
          method={addFilterCheckbox}
        />
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
          name="employeeCount"
          title="👥 Company size"
          options={employeeCounts}
        />
        <CustomSelect
          onChangeHandler={addFilterSelect}
          name="location"
          title="📍Location"
          options={locations}
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
        {companiesToDisplay.length && !isLoading ? (
          companiesToDisplay.map((company, idx) => {
            return (
              <Link
                href={`/candidates/companies/${company.companyId}`}
                key={`company${idx}`}
              >
                <CompanyCard company={company}/>
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

export default CandidateCompanyPage;
