import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useState } from "react";
import CompanyProfile from "../../../components/CompanyProfile";

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await getDoc(doc(db, "companies", id));
  let company = res.data();
  return {
    props: { company: company },
  };
};

export const getStaticPaths = async () => {
  let companies = [];
  const snapshot = await getDocs(collection(db, "companies"));
  snapshot.forEach((doc) => {
    companies.push({ ...doc.data() });
  });

  const paths = companies.map((company) => {
    return {
      params: { id: company.companyId },
    };
  });

  return {
    paths,
    fallback: false,
  };
};
const CompanyDetails = ({ company }) => {
  const [jobsList, setJobsList] = useState([]);

  const getJobs = async () => {
    let list = [];
    for (let i = 0; i < company.jobs.length; i++) {
      let res = await getDoc(doc(db, "jobs", company.jobs[i]));
      list.push(res.data());
    }
    setJobsList(list);
  };

  useState(() => {
    getJobs();
  }, []);

  useState(() => {
    console.log(jobsList);
  }, [jobsList]);

  return (
    <CompanyProfile companyDetails={company} jobsList={jobsList} candidateIsViewing={true} />
  );
};

export default CompanyDetails;