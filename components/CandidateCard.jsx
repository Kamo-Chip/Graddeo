import jobCardStyles from "../styles/jobCardStyles.module.css";
import companyCardStyles from "../styles/companyCard.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";
import { HiUserCircle } from "react-icons/hi";

const CandidateCard = ({ candidate }) => {
  return (
    <div className={jobCardStyles.card}>
      <div className={companyCardStyles.start}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <div className={jobCardStyles.logoContainer}>
            <Image
              loader={() => candidate.profilePhoto}
              src={candidate.profilePhoto}
              alt="profile photo"
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
              {candidate.name}
            </span>
            <span>{candidate.education[0].major}</span>
          </div>
          <div className={companyCardStyles.skills}>
            {candidate.skills.map((skill, idx) => {
              if (idx < 5) {
                return (
                  <div
                    key={`skill${idx}`}
                    className={utilityStyles.roundOut}
                    style={{ margin: "0 .25rem" }}
                  >
                    {skill}
                  </div>
                );
              }
            })}
            <span style={{ paddingTop: ".5rem" }}>
              {candidate.skills.length > 5 ? "..." : null}
            </span>
          </div>
        </div>
        <div className={`${companyCardStyles.bioContainer}`}>
          {candidate.bio}
        </div>
        <div className={jobCardStyles.detailsContainer}>
          <div className={jobCardStyles.details}>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              📍{candidate.location}
            </span>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              {candidate.schoolYear}
            </span>
            <span className={utilityStyles.roundOut}>
              🏫{candidate.education[0].institution}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
