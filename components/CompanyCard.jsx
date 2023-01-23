import cardStyles from "../styles/card.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";

const CompanyCard = ({ company }) => {
  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.start}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Image
            loader={() => company.logo}
            src={company.logo}
            alt="company logo"
            height={60}
            width={60}
            className={utilityStyles.profilePhoto}
            style={{marginRight: "1rem"}}
          />

          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
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
            <span
              className={utilityStyles.itemBar}
              style={{
                fontSize: "12px",
                marginLeft: "auto",
                backgroundColor: "var(--color-1)",
              }}
            >
              {company.jobs.length > 1
                ? company.jobs.length + " open jobs"
                : company.jobs.length + " open job"}
            </span>
          </div>
        </div>
        <div className={`${cardStyles.bioContainer}`}>{company.bio}</div>
        <div className={cardStyles.detailsContainer}>
          <div className={cardStyles.details}>
            <span
              className={utilityStyles.itemBar}
              style={{ marginRight: ".5em", backgroundColor: "#fff"  }}
            >
              📍{company.location ? company.location : "Location"}
            </span>
            <span
              className={utilityStyles.itemBar}
              style={{ marginRight: ".5em", backgroundColor: "#fff" }}
            >
              👥 {company.employeeCount}
            </span>
            <span className={utilityStyles.itemBar} style={{backgroundColor: "#fff" }}>{company.industry}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
