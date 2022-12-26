import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { db, auth } from "../../firebase";
import { timeSincePosted, formatSalary } from "../../lib/format";
import jobDetailStyles from "../../styles/jobDetail.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

  job.datePosted = timeSincePosted(job.datePosted);

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

const JobDetails = ({ job }) => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const applyToJob = async () => {
    if (user) {
      console.log(user);
      console.log("applying");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className={jobDetailStyles.container}>
      <div className={utilityStyles.formAndDetails}>
        <div className={jobDetailStyles.header}>
          <Image
            loader={() => job.companyLogo}
            src={job.companyLogo}
            alt="company logo"
            height={80}
            width={80}
          />
          <h1>
            {job.position}
            <span>
              <Link href={`/companies/${job.companyName}`}>
                {job.companyName}
              </Link>
            </span>
          </h1>
          <button onClick={applyToJob}>Apply</button>
        </div>
        <div className={jobDetailStyles.detailItemsContainer}>
          <div>
            <h2>Description</h2>
            <p>{job.description}</p>
          </div>
          <div>
            <h2>Salary</h2>
            <span>
              R
              {job.salary}
              {job.salaryIsNegotiable ? "(Negotiable)" : null}
            </span>
          </div>
          <div>
            <h2>Benefits</h2>
            <div className={jobDetailStyles.benefitsContainer}>
              {job.benefits.map((attribute, idx) => {
                return (
                  <div
                    key={`postAttr${idx}`}
                    className={utilityStyles.roundOut}
                  >
                    {attribute}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button style={{ marginTop: "2rem" }} onClick={applyToJob}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
