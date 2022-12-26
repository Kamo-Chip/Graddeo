import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import jobDetailStyles from "../../styles/jobDetail.module.css";
import Image from "next/image";
import Link from "next/link";
import { formatText } from "../../lib/format";
import { useState } from "react";
import JobCard from "../../components/JobCard";
import jobCardStyles from "../../styles/jobCardStyles.module.css";

export const getStaticProps = async (context) => {
  const q = query(
    collection(db, "companies"),
    where("name", "==", context.params.id)
  );
  const querySnapshot = await getDocs(q);

  let company = null;
  querySnapshot.forEach((doc) => {
    company = doc.data();
  });

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
      params: { id: company.name },
    };
  });

  return {
    paths,
    fallback: false,
  };
};
const CompanyDetails = ({ company }) => {
  const [jobList, setJobList] = useState([]);

  const getJobs = () => {
    company.jobs.forEach((job) => {
      let q = query(collection(db, "jobs"), where("jobId", "==", job));
      getDocs(q).then((res) => {
        setJobList((prevState) => [...prevState, res.docs[0].data()]);
      });
    });
  };

  useState(() => {
    getJobs();
  }, []);

  useState(() => {
    console.log(jobList);
  }, [jobList]);

  return (
    <div className={jobDetailStyles.container}>
      <div className={utilities.formAndDetails}>
        <div
          className={jobDetailStyles.header}
          style={{ alignSelf: "flex-start" }}
        >
          <Image
            loader={() => company.logo}
            src={company.logo}
            alt="company logo"
            height={80}
            width={80}
          />
          <h1>
            {company.name}
            <span style={{ textTransform: "lowercase" }}>
              <Link href={company.site}>{formatText(company.site)}</Link>
            </span>
          </h1>
        </div>
        <div className={jobDetailStyles.detailItemsContainer}>
          <div>
            <h2>Description</h2>
            <p>{company.description}</p>
          </div>
          <div>
            <h2>Jobs</h2>
            <div>
              {jobList.map((job, idx) => {
                return (
                  <Link
                    href={`/jobs/${job.jobId}`}
                    className={jobCardStyles.link}
                    key={`jobList${idx}`}
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
              })}
            </div>
          </div>
        </div>
        {/* {console.log(jobList)} */}
      </div>
    </div>
  );
};

export default CompanyDetails;
