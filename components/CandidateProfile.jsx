import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import profileStyles from "../styles/profile.module.css";
import utilityStyles from "../styles/utilities.module.css";
import createProfileStyles from "../styles/createProfile.module.css";
import Image from "next/image";
import { formatDate, formatText } from "../lib/format";
import Link from "next/link";
import {
  BsLinkedin,
  BsGithub,
  BsTwitter,
  BsYoutube,
  BsLink45Deg,
} from "react-icons/bs";
import {
  MdBookmark,
  MdBookmarkAdd,
  MdBookmarkRemove,
  MdLogout,
} from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";

const CandidateProfile = ({
  candidate,
  candidateIsViewing,
  signout,
  addToBookmarkedCandidates,
}) => {
  return (
    <div className={profileStyles.container}>
      {/* {console.log(candidate)} */}
      <div
        className={`${utilityStyles.form}`}
        style={{ alignItems: "unset", padding: "0 2em 2em 2em" }}
      >
        <div className={profileStyles.section}>
          <div className={profileStyles.contactContainer}>
            <h2
              className={utilityStyles.leftAlignedText}
              style={{ whiteSpace: "nowrap" }}
            >
              👤Personal Details
            </h2>
            {!candidateIsViewing ? (
              <span className={profileStyles.contactBtns}>
                <span onClick={addToBookmarkedCandidates}>
                  <MdBookmark />
                </span>
                <span style={{ textAlign: "center", width: "112px" }}>
                  <Link href={`mailto:${candidate.email}`} target="_blank">
                    Send email
                  </Link>
                </span>
                {candidate.phoneNumber ? (
                  <span style={{ textAlign: "center", width: "112px" }}>
                    <Link
                      href={`https://wa.me/${candidate.phoneNumber}`}
                      target="_blank"
                    >
                      Send Message
                    </Link>
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>

          <div className={profileStyles.personalContainer}>
            {!candidate.profilePhoto ? (
              <HiUserCircle size="110px" color="gray" />
            ) : (
              <Image
                loader={() => candidate.profilePhoto}
                src={candidate.profilePhoto}
                width={110}
                height={110}
                alt="profile photo"
                style={{ borderRadius: "50%", marginRight: "2rem" }}
              />
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className={utilityStyles.headerTextN}>
                {candidate.name}
              </span>
              <span className={utilityStyles.grayedOutText}>
                📍{candidate.location}
              </span>
              <a
                href={`mailto:${candidate.email}`}
                className={utilityStyles.grayedOutText}
              >
                📧{candidate.email}
              </a>
              <span className={profileStyles.bio}>{candidate.bio}</span>
            </div>
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2>🎓Education</h2>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>Degree</span>
            </div>
            <span>{candidate.degree}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>Institution</span>
            </div>
            <span>{candidate.institution}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>School year</span>
            </div>
            <span>{candidate.schoolYear}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>
                {candidate.currentlyStudying
                  ? "Graduating in "
                  : "Graduated in "}
              </span>
            </div>
            <span> {candidate.graduationYear}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>High school</span>
            </div>
            <span>{candidate.highSchool}</span>
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2>🧠Experience</h2>
          {candidate.experience
            ? candidate.experience.map((experience, index) => {
                return (
                  <div
                    key={`experience${index}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "1rem 0",
                    }}
                  >
                    <span className={utilityStyles.headerTextN}>
                      {experience.position}
                    </span>
                    <span className={utilityStyles.grayedOutText}>
                      {experience.company}
                    </span>
                    <span>
                      {formatDate(experience.start)} -{" "}
                      {formatDate(experience.end)}
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        <div className={profileStyles.section}>
          <h2 style={{ marginBottom: "1.5rem" }}>🤹Skills</h2>
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {candidate.skills
              ? candidate.skills.map((skill, index) => {
                  return (
                    <span
                      key={`skill${index}`}
                      className={utilityStyles.roundOut}
                      style={{ margin: "0 .5rem .5rem 0" }}
                    >
                      <b>{skill}</b>
                    </span>
                  );
                })
              : null}
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2>🔗Links</h2>
          {candidate.linkedIn ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsLinkedin /> LinkedIn
                </span>
              </div>
              <Link
                href={`https://www.linkedin.com/in/${candidate.linkedIn}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {candidate.linkedIn}
              </Link>
            </div>
          ) : null}
          {candidate.gitHub ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsGithub /> GitHub
                </span>
              </div>
              <Link
                href={`https://github.com/${candidate.gitHub}`}
                style={{ color: "var(--link-color)" }}
                target="_blank"
              >
                {candidate.gitHub}
              </Link>
            </div>
          ) : null}
          {candidate.twitter ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsTwitter />
                  Twitter
                </span>
              </div>
              <Link
                href={`https://twitter.com/${candidate.twitter}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {candidate.twitter}
              </Link>
            </div>
          ) : null}
          {candidate.youTube ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsYoutube /> YouTube
                </span>
              </div>
              <Link
                href={`https://www.youtube.com/@${candidate.youTube}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {candidate.gitHub}
              </Link>
            </div>
          ) : null}
          {candidate.portfolio ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsLink45Deg /> Portfolio
                </span>
              </div>
              <Link
                href={candidate.portfolio}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {formatText(candidate.portfolio)}
              </Link>
            </div>
          ) : null}
        </div>
        <div className={profileStyles.section}>
          <h2>🤩Desired Roles</h2>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>Job type</span>
            </div>
            <span style={{ marginBottom: "1rem" }}>{candidate.jobType}</span>
          </div>
          <span className={utilityStyles.headerTextN}>Roles</span>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            {candidate.roles
              ? candidate.roles.map((role, index) => {
                  return (
                    <span
                      key={`role${index}`}
                      className={utilityStyles.roundOut}
                      style={{ margin: "0 .5rem .5rem 0" }}
                    >
                      <b>{role}</b>
                    </span>
                  );
                })
              : null}
          </div>
        </div>

        <div className={profileStyles.section} style={{ padding: "0" }}>
          <h2 style={{ marginBottom: "1rem" }}>🧪Projects</h2>
          {candidate.projects
            ? candidate.projects.map((project, index) => {
                return (
                  <div
                    key={`project${index}`}
                    className={profileStyles.project}
                  >
                    <span className={utilityStyles.headerTextN}>
                      {project.name}
                    </span>
                    <span className={profileStyles.projectDescription}>
                      {project.description}
                    </span>
                    <Link
                      href={project.link}
                      target="_blank"
                      style={{
                        color: "var(--link-color)",
                        whiteSpace: "nowrap",
                        maxWidth: "80%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {formatText(project.link)}
                    </Link>
                  </div>
                );
              })
            : null}
        </div>
        <div className={profileStyles.section}>
          <h2 style={{ marginBottom: "1rem" }}>📄Documents</h2>
          {candidate.resume ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className={utilityStyles.headerTextN}>Resume</span>
              <Link
                href={candidate.resume}
                target="_blank"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: ".5rem",
                  maxWidth: "fit-content",
                }}
                className={`${utilityStyles.roundOut} ${profileStyles.resume}`}
              >
                {candidate.resumeName}
              </Link>
            </div>
          ) : null}
        </div>
        {candidateIsViewing ? (
          <button
            onClick={() =>
              Router.push(
                {
                  pathname: "/candidates/create-profile",
                  query: { data: JSON.stringify(userDetails) },
                },
                "/candidates/edit-profile"
              )
            }
          >
            Edit profile
          </button>
        ) : null}
      </div>
      {candidateIsViewing ? (
        <button
          style={{
            marginBottom: "1rem",
          }}
          onClick={signout}
        >
          <MdLogout /> Logout
        </button>
      ) : null}
    </div>
  );
};

export default CandidateProfile;
