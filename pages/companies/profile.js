import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import CompanyProfile from "../../components/CompanyProfile";

const CompanyProfilePage = () => {
  const [user, loading ] = useAuthState(auth);
  const [companyDetails, setCompanyDetails] = useState({});
  const [jobsList, setJobsList] = useState([]);
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState([]);
  const router = useRouter();

  const getCompanyDetails = async () => {
    const result = await getDoc(doc(db, "companies", user.uid));
    const data = result.data();
    setCompanyDetails(data);
  };

  const getJobs = async () => {
    let list = [];
    for (let i = 0; i < companyDetails.jobs.length; i++) {
      let res = await getDoc(doc(db, "jobs", companyDetails.jobs[i]));
      list.push(res.data());
    }
    setJobsList(list);
  };

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (e) => {
    const jobToDelete = e.currentTarget.id.split("-")[1];
    await deleteDoc(doc(db, "jobs", jobToDelete));

    let newJobs = companyDetails.jobs.filter(job => job != jobToDelete);
    await updateDoc(doc(db, "companies", companyDetails.companyId), {
      jobs: newJobs,
    });

    let newJobsList = jobsList.filter(job => job.jobId != jobToDelete);
    setJobsList(newJobsList);
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies/");
    }

    if (user) {

      getCompanyDetails();
    }
  }, [user, loading]);

  useEffect(() => {
    if (companyDetails.name) {
      getJobs();
    }
  }, [companyDetails]);

  return (
    <CompanyProfile companyDetails={companyDetails} jobsList={jobsList} signout={signout} deleteJob={deleteJob}/>
  );
};

export default CompanyProfilePage;
