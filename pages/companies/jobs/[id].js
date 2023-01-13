import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import {
  timeSincePosted,
  convertToDate,
  formatDateDayMonthYear,
  formatDateDayMonth,
} from "../../../lib/format";
import JobDetails from "../../../components/JobDetails";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getStaticProps = async (context) => {
  const q = query(
    collection(db, "jobs"),
    where("jobId", "==", context.params.id)
  );
  const querySnapshot = await getDocs(q);

  let job = null;
  querySnapshot.forEach((doc) => {
    job = doc.data();
  });

  job.datePosted = timeSincePosted(job.datePosted);
  job.deadline = convertToDate(job.deadline).toString();
  if (job.jobStartDate) {
    job.jobStartDate = formatDateDayMonth(
      convertToDate(job.jobStartDate).toString()
    );
    job.jobEndDate = formatDateDayMonthYear(
      convertToDate(job.jobEndDate).toString()
    );
  }
  return {
    props: { job: job },
  };
};

export const getStaticPaths = async () => {
  let jobs = [];
  const snapshot = await getDocs(collection(db, "jobs"));
  snapshot.forEach((doc) => {
    jobs.push({ ...doc.data() });
  });

  const paths = jobs.map((job) => {
    return {
      params: { id: job.jobId },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

const CompanyJobDetails = ({ job }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    }
  }, [loading, user]);

  return <JobDetails job={job} candidateIsViewing={false} />;
};

export default CompanyJobDetails;
