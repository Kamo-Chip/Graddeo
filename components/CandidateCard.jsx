import cardStyles from "../styles/card.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";
import { HiUserCircle } from "react-icons/hi";

const CandidateCard = ({ candidate }) => {
  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.start}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <div className={cardStyles.logoContainer}>
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
                height: "25px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {candidate.name}
            </span>
            <span>{candidate.education[0].major}</span>
          </div>
          <div className={cardStyles.skills}>
            {candidate.skills.map((skill, idx) => {
              if (idx < 5) {
                return (
                  <div
                    key={`skill${idx}`}
                    className={utilityStyles.itemBar}
                    style={{ backgroundColor: "var(--color-5)", color: "#fff" }}
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
        <div className={`${cardStyles.bioContainer}`}>{candidate.bio}</div>
        <div className={cardStyles.detailsContainer}>
          <div className={cardStyles.details}>
            <span
              className={utilityStyles.itemBar}
              style={{ marginRight: ".5em", backgroundColor: "#fff" }}
            >
              📍{candidate.location}
            </span>
            <span
              className={utilityStyles.itemBar}
              style={{ marginRight: ".5em", backgroundColor: "#fff" }}
            >
              {candidate.schoolYear}
            </span>
            <span
              className={utilityStyles.itemBar}
              style={{ backgroundColor: "#fff" }}
            >
              🏫{candidate.education[0].institution}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
