import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { useState } from "react";
import CompanyProfile from "../../../components/CompanyProfile";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

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
    if (!loading && !user) {
      router.push("/candidates");
    }
  }, [loading, user]);

  return (
    <CompanyProfile
      companyDetails={company}
      jobsList={jobsList}
      candidateIsViewing={true}
    />
  );
};

export default CompanyDetails;
