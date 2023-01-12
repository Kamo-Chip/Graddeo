import jobCardStyles from "../styles/jobCardStyles.module.css";
import Image from "next/image";
import Link from "next/link";
import utilityStyles from "../styles/utilities.module.css";
import { timeSincePosted, formatSalary } from "../lib/format";
import { HiUserCircle } from "react-icons/hi";

const CandidateCard = ({
  bio,
  candidateId,
  courses,
  currentlyStudying,
  degree,
  email,
  experience,
  gitHub,
  graduationYear,
  hasExperience,
  hasPersonalWebsite,
  hasProjects,
  highSchool,
  imageName,
  institution,
  jobType,
  linkedIn,
  location,
  name,
  portfolio,
  profilePhoto,
  projects,
  resume,
  resumeName,
  roles,
  schoolYear,
  sex,
  skills,
  twitter,
  youTube,
}) => {
  return (
    <div className={jobCardStyles.card} style={{ height: "180px" }}>
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
            {profilePhoto ? (
              <Image
                loader={() => profilePhoto}
                src={profilePhoto}
                alt="profile photo"
                height={60}
                width={60}
              />
            ) : (
              <HiUserCircle size="60px" color="gray"/>
            )}
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
              {name}
            </span>
            <span>{degree}</span>
          </div>
        </div>

        <div className={jobCardStyles.detailsContainer}>
          <div className={jobCardStyles.details}>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              📍{location}
            </span>
            <span
              className={utilityStyles.roundOut}
              style={{ marginRight: ".5em" }}
            >
              🏫{institution}
            </span>
            <span className={utilityStyles.roundOut}>{schoolYear}</span>
          </div>
        </div>
      </div>

      <div className={jobCardStyles.benefitsContainer}>
        <ul className={jobCardStyles.benefitsList}>
          {skills.map((attribute, idx) => {
            return (
              <li key={`jobAttribute${idx}`} className={utilityStyles.roundOut}>
                {attribute}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CandidateCard;
