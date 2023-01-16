import { collection, getDocs, getDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import {
  timeSincePosted,
  convertToDate,
  formatDateDayMonthYear,
  formatDateDayMonth,
  formatSalary,
} from "../../../lib/format";
import JobDetails from "../../../components/JobDetails";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

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

  job.salary = formatSalary(job.salary);
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

const CandidateJobDetails = ({ job }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const getBookmarkedJobs = async () => {
    const res = await getDoc(doc(db, "candidates", user.uid));
    setBookmarkedJobs(res.data().bookmarkedJobs);
  };

  const addToBookmarkedJobs = async (e) => {
    let newBookmarkedJobs = [];
    if (!bookmarkedJobs.includes(job.jobId)) {
      e.currentTarget.children[0].style.color = "red";
      newBookmarkedJobs.push(job.jobId);
      setBookmarkedJobs([...bookmarkedJobs, job.jobId]);
    } else {
      e.currentTarget.children[0].style.color = "#000";
      for (let i = 0; i < bookmarkedJobs.length; i++) {
        if (bookmarkedJobs[i] != job.jobId) {
          newBookmarkedJobs.push(bookmarkedJobs[i]);
        }
      }
      setBookmarkedJobs(newBookmarkedJobs);
    }
    await updateDoc(doc(db, "candidates", user.uid), {
      bookmarkedJobs: newBookmarkedJobs,
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/candidates");
    }else if(!loading && user) {
      getBookmarkedJobs();
    }
  }, [loading, user]);

  return <JobDetails job={job} candidateIsViewing={true} addToBookmarkedJobs={addToBookmarkedJobs} bookmarkedJobs={bookmarkedJobs}/>;
};
export default CandidateJobDetails;
