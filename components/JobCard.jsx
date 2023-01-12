import jobCardStyles from "../styles/jobCardStyles.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";

const JobCard = ({
  companyName,
  position,
  jobType,
  benefits,
  location,
  salary,
  salaryIsNegotiable,
  description,
  applitcationURL,
  applicationEmail,
  companyLogo,
  hasCustomBackground,
  background,
  datePosted,
  companyEmail,
  invoiceEmail,
  jobId,
  salaryType,
}) => {
  return (
    <div className={jobCardStyles.card} style={{ backgroundColor: background }}>
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
              loader={() => companyLogo}
              src={companyLogo}
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
              {position ? position : "Position"}
            </span>
            <span>{companyName ? companyName : "Company"}</span>
          </div>
        </div>

        <div className={jobCardStyles.detailsContainer}>
          <div className={jobCardStyles.details}>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              📍{location ? location : "Location"}
            </span>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              💵{salary ? "R" + formatSalary(salary) : "Salary"}
              {salaryType.includes("year")
                ? "/yr"
                : salaryType.includes("month")
                ? "/mo"
                : salaryType.includes("hour")
                ? "/hr"
                : null}
            </span>
            <span className={utilityStyles.roundOut}>
              {jobType ? jobType : "Job type"}
            </span>
          </div>
        </div>
      </div>

      <div className={jobCardStyles.benefitsContainer}>
        <ul className={jobCardStyles.benefitsList}>
          {benefits.map((attribute, idx) => {
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
      {datePosted ? (
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
          {timeSincePosted(datePosted)}
        </div>
      ) : null}
    </div>
  );
};

export default JobCard;
