import jobCardStyles from "../styles/jobCardStyles.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";

const JobCard = ({
job
}) => {
  return (
    <div className={jobCardStyles.card} style={{ backgroundColor: job.background }}>
      <div className={jobCardStyles.start}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            marginRight: "auto",
          }}
        >
          <div className={jobCardStyles.logoContainer}>
            <Image
              loader={() => job.companyLogo}
              src={job.companyLogo}
              alt="company logo"
              height={60}
              width={60}
              className={utilityStyles.profilePhoto}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              className={utilityStyles.headerText}
              style={{
                maxWidth: "280px",
                height: "20px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.position ? job.position : "Position"}
            </span>
            <span>{job.companyName ? job.companyName : "Company"}</span>
          </div>
        </div>

        <div className={jobCardStyles.detailsContainer}>
          <div className={jobCardStyles.details}>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              📍{job.location ? job.location : "Location"}
            </span>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              💵{job.salary ? "R" + formatSalary(job.salary) : "Salary"}
              {job.salaryType.includes("year")
                ? "/yr"
                : job.salaryType.includes("month")
                ? "/mo"
                : job.salaryType.includes("hour")
                ? "/hr"
                : null}
            </span>
            <span className={utilityStyles.roundOut}>
              {job.jobType ? job.jobType : "Job type"}
            </span>
          </div>
        </div>
      </div>

      <div className={jobCardStyles.benefitsContainer}>
        <ul className={jobCardStyles.benefitsList}>
          {job.benefits.map((attribute, idx) => {
            if (idx < 6) {
              return (
                <li
                  key={`jobAttribute${idx}`}
                  className={utilityStyles.roundOut}
                >
                  {attribute}
                </li>
              );
            }
          })}
        </ul>
      </div>
      {job.datePosted ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifySelf: "flex-end",
            marginLeft: "auto",
          }}
          className={jobCardStyles.date}
        >
          {timeSincePosted(job.datePosted)}
        </div>
      ) : null}
    </div>
  );
};

export default JobCard;
