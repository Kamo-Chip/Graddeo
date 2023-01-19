import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { db, auth } from "../firebase";
import {
  timeSincePosted,
  formatSalary,
  convertToDate,
  formatDate,
  formatDateDayMonthYear,
  formatDateDayMonth,
} from "../lib/format";
import jobDetailStyles from "../styles/jobDetail.module.css";
import utilityStyles from "../styles/utilities.module.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { HiUserCircle } from "react-icons/hi";
import { MdBookmark } from "react-icons/md";

const JobDetails = ({
  job,
  candidateIsViewing,
  addToBookmarkedJobs,
  bookmarkedJobs,
  candidateId,
}) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const applyToJob = async () => {
    if (user) {
      await updateDoc(doc(db, "companies", job.companyId), {
        prospectiveCandidates: arrayUnion({
          candidateId: candidateId,
          jobName: job.position,
          jobId: job.jobId,
        }),
      });
      console.log("applying");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className={utilityStyles.containerFlex}>
      {console.log(bookmarkedJobs)}
      {console.log(job)}
      <div className={utilityStyles.form}>
        <div className={jobDetailStyles.header}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <h1>{job.position}</h1>
            {candidateIsViewing ? (
              <span onClick={addToBookmarkedJobs}>
                <MdBookmark
                  size="2rem"
                  color={bookmarkedJobs.includes(job.jobId) ? "red" : "#000"}
                />
              </span>
            ) : null}
          </div>

          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}
          >
            <Link
              href={
                candidateIsViewing
                  ? `/candidates/companies/${job.companyId.split("-")[1]}`
                  : "/companies/profile"
              }
            >
              <Image
                loader={() => job.companyLogo}
                src={job.companyLogo}
                alt="logo"
                width={60}
                height={60}
                className={utilityStyles.profilePhoto}
              />
            </Link>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link
                href={
                  candidateIsViewing
                    ? `/candidates/companies/${job.companyId.split("-")[1]}`
                    : "/companies/profile"
                }
              >
                <span className={utilityStyles.headerTextN}>
                  {job.companyName}
                </span>
              </Link>
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div
          className={jobDetailStyles.detailItemsContainer}
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <h2 style={{ alignSelf: "flex-start" }}>About the role</h2>
          <div className={jobDetailStyles.roleDetailsContainer}>
            <JobDetail
              title="💼 Job type"
              value={
                job.jobType.includes("Full")
                  ? "Full-time"
                  : job.jobType.includes("Part")
                  ? "Part-time"
                  : job.jobType.includes("Intern")
                  ? "Internship"
                  : null
              }
            />
            <JobDetail
              title="⏳ Duration"
              value={
                job.duration.includes("Temporary") ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Temporary</span>
                    <span>
                      {job.jobStartDate}-{job.jobEndDate}
                    </span>
                  </div>
                ) : job.duration.includes("Permanent") ? (
                  "Permanent"
                ) : null
              }
            />
            <JobDetail
              title="💵 Salary"
              value={`R${job.salary.concat(
                job.salaryType.includes("hour")
                  ? "/hr"
                  : job.salaryType.includes("month")
                  ? "/mo"
                  : job.salaryType.includes("year")
                  ? "/yr"
                  : null
              )}`}
            />

            <JobDetail
              title="🌐 Work authorisation"
              value={
                job.authorisation && job.canSponsor
                  ? "Required. We will sponsor candidates in need"
                  : job.authorisation && !job.canSponsor
                  ? "Required. We cannot sponsor candidates"
                  : !job.authorisation
                  ? "Not required"
                  : null
              }
            />
            <JobDetail
              title="⏰ Application deadline"
              value={formatDateDayMonthYear(job.deadline)}
            />
            <JobDetail
              title="📡 Remote"
              value={
                job.remoteOk
                  ? "Remote workers allowed"
                  : "Remote workers not allowed"
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "2rem 0",
            }}
          >
            {candidateIsViewing ? (
              <button
                className={utilityStyles.formButton}
                style={{ marginBottom: "1rem" }}
                onClick={applyToJob}
              >
                Apply
              </button>
            ) : null}

            {job.openToTalk ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "1rem",
                }}
              >
                <span
                  className={utilityStyles.headerTextN}
                  style={{ marginBottom: "1rem" }}
                >
                  Hiring manager
                </span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {job.hiringManager.image ? (
                    <Image
                      loader={() => job.hiringManager.image}
                      src={job.hiringManager.image}
                      alt="Hiring mananger"
                      width={70}
                      height={70}
                      className={utilityStyles.profilePhoto}
                    />
                  ) : (
                    <HiUserCircle size="70px" color="gray" />
                  )}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{ marginLeft: ".5rem" }}
                      className={utilityStyles.headerTextNSmall}
                    >
                      {job.hiringManager.name}
                    </span>
                    <a
                      href={`mailto:${job.hiringManager.email}`}
                      style={{ marginLeft: ".5rem", marginTop: ".5rem" }}
                      className={utilityStyles.formButton}
                    >
                      Message
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div
            className={jobDetailStyles.roleItem}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <span
              className={utilityStyles.headerTextN}
              style={{ marginBottom: "1rem" }}
            >
              Role description
            </span>
            <span style={{ whiteSpace: "pre-wrap" }}>{job.description}</span>
          </div>
          <div className={jobDetailStyles.roleItem}>
            <span className={utilityStyles.headerTextN}>Skills</span>
            <div
              style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}
            >
              {job.skills.map((benefit, idx) => {
                return (
                  <div
                    key={`benefit${idx}`}
                    className={utilityStyles.itemBar}
                    style={{
                      backgroundColor: "var(--color-5)",
                      color: "#fff",
                      marginBottom: ".5rem",
                    }}
                  >
                    {benefit}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={jobDetailStyles.roleItem}>
            <span className={utilityStyles.headerTextN}>Perks & Benefits</span>
            <div
              style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}
            >
              {job.benefits.map((benefit, idx) => {
                return (
                  <div
                    key={`benefit${idx}`}
                    className={utilityStyles.itemBar}
                    style={{ backgroundColor: "#fff", marginBottom: ".5rem" }}
                  >
                    {benefit}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button className={utilityStyles.formButton} onClick={applyToJob}>
          Apply
        </button>
      </div>
    </div>
  );
};

const JobDetail = ({ title, value }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "175px",
        minHeight: "80px",
      }}
    >
      <span
        className={utilityStyles.headerTextNSmall}
        style={{ marginBottom: ".5rem" }}
      >
        {title}
      </span>
      <span>{value}</span>
    </div>
  );
};

export default JobDetails;
