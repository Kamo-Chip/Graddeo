import jobCardStyles from "../styles/jobCardStyles.module.css";
import companyCardStyles from "../styles/companyCard.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";

const CompanyCard = ({ company }) => {
  return (
    <div className={jobCardStyles.card}>
      <div className={companyCardStyles.start}>
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
              loader={() => company.logo}
              src={company.logo}
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
              {company.name}
            </span>
            <span>
              {company.jobs.length > 1
                ? company.jobs.length + " open jobs"
                : company.jobs.length + " open job"}
            </span>
          </div>
        </div>
        <div className={`${companyCardStyles.bioContainer}`}>
            {company.bio}
        </div>
        <div className={jobCardStyles.detailsContainer}>
          <div className={jobCardStyles.details}>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              📍{company.location ? company.location : "Location"}
            </span>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              👥 {company.employeeCount}
            </span>
            <span className={utilityStyles.roundOut}>{company.industry}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
