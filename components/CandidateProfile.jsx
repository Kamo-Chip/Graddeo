import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import profileStyles from "../styles/profile.module.css";
import utilityStyles from "../styles/utilities.module.css";
import createProfileStyles from "../styles/createProfile.module.css";
import Image from "next/image";
import { formatDate, formatPhoneNumber, formatText } from "../lib/format";
import Link from "next/link";
import {
  BsLinkedin,
  BsGithub,
  BsTwitter,
  BsYoutube,
  BsLink45Deg,
  BsInstagram,
} from "react-icons/bs";
import { CgExternal } from "react-icons/cg";
import {
  MdBookmark,
  MdBookmarkAdd,
  MdBookmarkRemove,
  MdLogout,
} from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";
import { isAfter } from "date-fns";

const CandidateProfile = ({
  candidate,
  candidateIsViewing,
  signout,
  addToBookmarkedCandidates,
}) => {
  return (
    <div className={profileStyles.container}>
      {console.log(candidate)}
      <div className={`${utilityStyles.form}`} style={{ alignItems: "unset" }}>
        <div className={profileStyles.section}>
          <div className={profileStyles.contactContainer}>
            <h2
              className={utilityStyles.leftAlignedText}
              style={{ whiteSpace: "nowrap" }}
            >
              {candidateIsViewing ? "Your profile" : "👤 Personal details"}
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
                style={{ marginRight: "2rem" }}
                className={utilityStyles.profilePhoto}
              />
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "1rem",
              }}
            >
              <span className={utilityStyles.headerTextN}>
                {candidate.name}
              </span>
              <span
                className={utilityStyles.grayedOutText}
                style={{ marginTop: ".25rem" }}
              >
                {candidate.schoolYear}
              </span>
              <span
                className={utilityStyles.grayedOutText}
                style={{ marginTop: ".25rem" }}
              >
                📍{candidate.location}
              </span>
              <span
                className={utilityStyles.grayedOutText}
                style={{ marginTop: ".25rem" }}
              >
                📧{candidate.email}
              </span>
              <span
                className={utilityStyles.grayedOutText}
                style={{ marginTop: ".25rem" }}
              >
                📞{formatPhoneNumber(candidate.phoneNumber)}
              </span>
              <span className={profileStyles.bio}>{candidate.bio}</span>
            </div>
          </div>
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>🎓Education</h2>
          {candidate.education
            ? candidate.education.map((element, idx) => {
                return (
                  <div
                    key={`education${idx}`}
                    className={`${utilityStyles.fieldContainer} ${profileStyles.education}`}
                  >
                    <span className={utilityStyles.headerTextNSmall}>
                      {element.educationLevel}{" "}
                      {element.major ? "in " + element.major : ""}
                    </span>
                    <span>{element.institution}</span>
                    <div>
                      <span>
                        {isAfter(
                          new Date(
                            `${element.graduationMonth}, ${element.graduationYear}`
                          ),
                          new Date()
                        )
                          ? "Graduates in "
                          : "Graduated in "}
                      </span>
                      <span>
                        {element.graduationMonth},{" "}
                        <span className={utilityStyles.headerTextNSmall}>
                          {element.graduationYear}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2 style={{ marginBottom: "1.5rem" }}>🤹Skills</h2>
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {candidate.skills
              ? candidate.skills.map((skill, index) => {
                  return (
                    <span
                      key={`skill${index}`}
                      className={utilityStyles.itemBar}
                      style={{
                        margin: "0 .5rem .5rem 0",
                        backgroundColor: "var(--color-5)",
                        color: "#fff",
                      }}
                    >
                      <b>{skill}</b>
                    </span>
                  );
                })
              : null}
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
                    <span className={utilityStyles.headerTextNSmall}>
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

        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>🔗Links</h2>
          {candidate.linkedIn ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
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
                <span className={utilityStyles.headerTextNSmall}>
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
                <span className={utilityStyles.headerTextNSmall}>
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
          {candidate.instagram ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
                  <BsInstagram />
                  Instagram
                </span>
              </div>
              <Link
                href={`https://www.instagram.com/${candidate.instagram}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {candidate.instagram}
              </Link>
            </div>
          ) : null}
          {candidate.youTube ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
                  <BsYoutube /> YouTube
                </span>
              </div>
              <Link
                href={`https://www.youtube.com/@${candidate.youTube}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {candidate.youTube}
              </Link>
            </div>
          ) : null}
          {candidate.portfolio ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
                  <BsLink45Deg /> Portfolio
                </span>
              </div>
              <Link
                href={`http://${candidate.portfolio}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {formatText(candidate.portfolio)}
              </Link>
            </div>
          ) : null}
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>🤩Desired Roles</h2>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextNSmall}>Job type</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {candidate.jobType
                ? candidate.jobType.map((element, idx) => {
                    return (
                      <div
                        key={`job${idx}`}
                        className={utilityStyles.itemBar}
                        style={{
                          width: "fit-content",
                          backgroundColor: "var(--color-5)",
                          color: "#fff",
                          margin: "0 .5rem 0 0",
                        }}
                      >
                        <b>{element}</b>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className={utilityStyles.labelContainer}>
            <span className={utilityStyles.headerTextNSmall}>Roles</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {candidate.roles
              ? candidate.roles.map((role, index) => {
                  return (
                    <span
                      key={`role${index}`}
                      className={utilityStyles.itemBar}
                      style={{
                        margin: "0 .5rem 0 0",
                        backgroundColor: "var(--color-5)",
                        color: "#fff",
                      }}
                    >
                      <b>{role}</b>
                    </span>
                  );
                })
              : null}
          </div>
        </div>

        <div className={profileStyles.section}>
          <h2 style={{ marginBottom: "1rem" }}>🧪Projects</h2>
          {candidate.projects
            ? candidate.projects.map((project, index) => {
                return (
                  <div
                    key={`project${index}`}
                    className={profileStyles.project}
                  >
                    <span className={utilityStyles.headerTextNSmall}>
                      {project.name}
                    </span>
                    <span className={profileStyles.projectDescription}>
                      {project.description}
                    </span>
                    <Link
                      href={`http://${project.link}`}
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
                      <CgExternal />
                    </Link>
                  </div>
                );
              })
            : null}
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2 style={{ marginBottom: "1rem" }}>📄Documents</h2>
          {candidate.resume ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className={utilityStyles.headerTextNSmall}>Resume</span>
              <Link
                href={candidate.resume}
                target="_blank"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: ".5rem",
                  maxWidth: "fit-content",
                  backgroundColor: "var(--color-5)",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                className={`${utilityStyles.itemBar} ${profileStyles.resume}`}
              >
                {candidate.resumeName}
                <CgExternal />
              </Link>
            </div>
          ) : null}
        </div>
        {candidateIsViewing ? (
          <>
            <button
              className={utilityStyles.formButton}
              style={{ alignSelf: "center", marginTop: "2rem" }}
              onClick={() =>
                Router.push(
                  {
                    pathname: "/candidates/create-profile",
                    query: { data: JSON.stringify(candidate) },
                  },
                  "/candidates/edit-profile"
                )
              }
            >
              Edit profile
            </button>
            <button
              style={{
                alignSelf: "center",
                marginTop: "1rem",
                backgroundColor: "var(--red)",
                color: "#fff",
              }}
              onClick={signout}
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CandidateProfile;
