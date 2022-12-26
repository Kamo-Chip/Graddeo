import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import Router, { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import profileStyles from "../../styles/profile.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import createProfileStyles from "../../styles/createProfile.module.css";
import Image from "next/image";
import { formatDate, formatText } from "../../lib/format";
import Link from "next/link";
import {
  BsLinkedin,
  BsGithub,
  BsTwitter,
  BsYoutube,
  BsLink45Deg,
} from "react-icons/bs";

const CandidateProfilePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();

  const getUserDetails = async () => {
    const result = await getDoc(doc(db, "candidates", user.uid));
    const data = result.data();
    setUserDetails(data);
  };


  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      getUserDetails();
    }
  }, [user, loading]);

  return (
    <div className={profileStyles.container}>
      <div
        className={`${utilityStyles.form}`}
        style={{ alignItems: "unset", padding: "0 2em 2em 2em" }}
      >
        <div className={profileStyles.section}>
          <h2 className={utilityStyles.leftAlignedText}>Personal Details</h2>
          <div className={profileStyles.personalContainer}>
            <Image
              loader={() => userDetails.profilePhoto}
              src={userDetails.profilePhoto}
              width={110}
              height={110}
              alt="profile photo"
              style={{ borderRadius: "50%", marginRight: "2rem" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className={utilityStyles.headerTextN}>
                {userDetails.name}
              </span>
              <span className={utilityStyles.grayedOutText}>
                📍{userDetails.location}
              </span>
              <span className={profileStyles.bio}>{userDetails.bio}</span>
            </div>
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2>🎓Education</h2>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>Degree</span>
            </div>
            <span>{userDetails.degree}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>Institution</span>
            </div>
            <span>{userDetails.institution}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>School year</span>
            </div>
            <span>{userDetails.schoolYear}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>
                {userDetails.currentlyStudying
                  ? "Graduating in "
                  : "Graduated in "}
              </span>
            </div>
            <span> {userDetails.graduationYear}</span>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <span className={utilityStyles.headerTextN}>High school</span>
            </div>
            <span>{userDetails.highSchool}</span>
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2>📑Courses</h2>
          {userDetails.courses
            ? userDetails.courses.map((course, index) => {
                return (
                  <div
                    key={`course${index}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "1rem 0 0 0",
                    }}
                  >
                    <span className={utilityStyles.headerTextN}>
                      {course.courseName}
                    </span>
                    <span className={utilityStyles.grayedOutText}>
                      {course.courseInstitution}
                    </span>
                    <span>
                      {formatDate(course.start)} - {formatDate(course.end)}
                    </span>
                    {course.linkToCourse ? (
                      <Link
                        href={course.linkToCourse}
                        target="_blank"
                        style={{ color: "var(--link-color)" }}
                      >
                        {formatText(course.linkToCourse)}
                      </Link>
                    ) : null}
                  </div>
                );
              })
            : null}
        </div>
        <div className={profileStyles.section}>
          <h2>🧠Experience</h2>
          {userDetails.experience
            ? userDetails.experience.map((experience, index) => {
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
            {userDetails.skills
              ? userDetails.skills.map((skill, index) => {
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
          {userDetails.linkedIn ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsLinkedin /> LinkedIn
                </span>
              </div>
              <Link
                href={`https://www.linkedin.com/in/${userDetails.linkedIn}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {userDetails.linkedIn}
              </Link>
            </div>
          ) : null}
          {userDetails.gitHub ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsGithub /> GitHub
                </span>
              </div>
              <Link
                href={`https://github.com/${userDetails.gitHub}`}
                style={{ color: "var(--link-color)" }}
                target="_blank"
              >
                {userDetails.gitHub}
              </Link>
            </div>
          ) : null}
          {userDetails.twitter ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsTwitter />
                  Twitter
                </span>
              </div>
              <Link
                href={`https://twitter.com/${userDetails.twitter}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {userDetails.twitter}
              </Link>
            </div>
          ) : null}
          {userDetails.youTube ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsYoutube /> YouTube
                </span>
              </div>
              <Link
                href={`https://www.youtube.com/@${userDetails.youTube}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {userDetails.gitHub}
              </Link>
            </div>
          ) : null}
          {userDetails.portfolio ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextN}>
                  <BsLink45Deg /> Portfolio
                </span>
              </div>
              <Link
                href={userDetails.portfolio}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {formatText(userDetails.portfolio)}
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
            <span style={{ marginBottom: "1rem" }}>{userDetails.jobType}</span>
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
            {userDetails.roles
              ? userDetails.roles.map((role, index) => {
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
          {userDetails.projects
            ? userDetails.projects.map((project, index) => {
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
          <h2 style={{ marginBottom: "1rem" }}>Documents</h2>
          {userDetails.resume ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className={utilityStyles.headerTextN}>Resume</span>
              <Link
                href={userDetails.resume}
                target="_blank"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: ".5rem",
                  maxWidth: "fit-content"
                }}
                className={`${utilityStyles.roundOut} ${profileStyles.resume}`}
              >
                {userDetails.resumeName}
              </Link>
            </div>
          ) : null}
        </div>
        <button onClick={() => Router.push({pathname: "/candidates/create-profile", query: {data: JSON.stringify(userDetails)}}, "/candidates/edit-profile")}>Edit profile</button>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
