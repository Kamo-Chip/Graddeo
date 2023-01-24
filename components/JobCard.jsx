import cardStyles from "../styles/card.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";

const JobCard = ({ job, companyProfileIsOpen }) => {
  return (
    <div
      className={cardStyles.jobCard}
      style={{ backgroundColor: job.background }}
    >
      <div className={cardStyles.jobStart}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            marginRight: "auto",
          }}
        >
          <div className={cardStyles.logoContainer}>
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
                height: "25px",
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

        <div className={cardStyles.detailsContainer}>
          <div className={cardStyles.details}>
            <span
              className={utilityStyles.itemBar}
              style={{
                marginLeft: "0",
                marginRight: ".5em",
                backgroundColor: "#fff",
              }}
            >
              📍{job.location ? job.location : "Location"}
            </span>
            <span
              className={utilityStyles.itemBar}
              style={{
                marginLeft: "0",
                marginRight: ".5em",
                backgroundColor: "#fff",
              }}
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
            <span
              className={utilityStyles.itemBar}
              style={{
                marginLeft: "0",
                marginRight: ".5em",
                backgroundColor: "#fff",
              }}
            >
              {job.jobType ? job.jobType : "Job type"}
            </span>
          </div>
        </div>
      </div>

      <div className={cardStyles.benefitsContainer}>
        <ul className={cardStyles.benefitsList}>
          {job.benefits.map((attribute, idx) => {
            if (idx < 5) {
              return (
                <li
                  key={`jobAttribute${idx}`}
                  className={utilityStyles.itemBar}
                  style={{ marginLeft: "0", backgroundColor: "#fff" }}
                >
                  {attribute}
                </li>
              );
            }
          })}
          <span>{job.benefits.length > 5 ? "..." : null}</span>
        </ul>
      </div>
      {!companyProfileIsOpen ? (
        job.datePosted ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              justifySelf: "flex-end",
              marginLeft: "auto",
            }}
            className={cardStyles.date}
          >
            {timeSincePosted(job.datePosted)}
          </div>
        ) : null
      ) : null}
    </div>
  );
};

export default JobCard;
