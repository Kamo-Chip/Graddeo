//Create Links Array

import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import jobFormStyles from "../../styles/jobForm.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import CustomSelect from "../../components/CustomSelect";
import { MdAddCircle, MdCancel } from "react-icons/md";
import createProfileStyles from "../../styles/createProfile.module.css";
import { db, storage } from "../../firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import {
  BsLinkedin,
  BsGithub,
  BsTwitter,
  BsYoutube,
  BsLink45Deg,
} from "react-icons/bs";
import Image from "next/image";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { HiUserCircle } from "react-icons/hi";

const CreateCandidateProfile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userDetails, setUserDetails] = useState({
    name: "",
    bio: "",
    sex: "",
    profilePhoto: "",
    imageName: "",
    degree: "",
    schoolYear: "",
    institution: "",
    graduationYear: "",
    highSchool: "",
    resume: "",
    resumeName: "",
    courses: [],
    currentlyStudying: false,
    experience: [],
    skills: [],
    roles: [],
    projects: [],
    hasExperience: false,
    jobType: "",
    hasProjects: false,
    hasPersonalWebsite: false,
    portfolio: "",
    location: "",
  });

  const [showSchoolYears, setShowSchoolYears] = useState(false);
  const [showSex, setShowSex] = useState(false);
  const [showJobType, setShowJobType] = useState(false);
  const router = useRouter();
  const { query } = router;

  const handleChangeForInput = (e) => {
    setUserDetails({ ...userDetails, [e.target.id]: e.target.value });
  };

  const handleChangeForSelect = (e) => {
    const source = e.target.parentElement.parentElement.id;
    const value = e.target.innerText;

    if (source == "schoolYear") {
      document.querySelector("#schoolYearTitle").innerText = value;
    } else if (source == "sex") {
      document.querySelector("#sexTitle").innerText = value;
    } else if (source == "jobType") {
      document.querySelector("#jobTypeTitle").innerText = value;
    }

    setUserDetails({
      ...userDetails,
      [source]: value,
    });
  };

  const handleChangeForMultiItems = (e) => {
    let tokens =
      e.target.parentElement.parentElement.parentElement.id.split("-");
    let id = tokens[0];
    let source = tokens[1];

    let arr = [];

    arr = userDetails[source];
    arr[id][e.target.id] = e.target.value;
    setUserDetails({ ...userDetails, [source]: arr });
  };

  const addSkill = (e) => {
    let skill = document.querySelector("#skills").value;
    document.querySelector("#skills").value = "";

    if (!userDetails.skills.includes(skill)) {
      setUserDetails({
        ...userDetails,
        skills: [...userDetails.skills, skill],
      });
    }
  };

  const addRole = (e) => {
    let role = document.querySelector("#roles").value;
    document.querySelector("#roles").value = "";

    if (!userDetails.roles.includes(role)) {
      setUserDetails({
        ...userDetails,
        roles: [...userDetails.roles, role],
      });
    }
  };

  const addCourse = (e) => {
    setUserDetails({
      ...userDetails,
      courses: [
        ...userDetails.courses,
        {
          courseName: "",
          courseInstitution: "",
          start: "",
          end: "",
          linkToCourse: "",
        },
      ],
    });
  };

  const addProject = () => {
    setUserDetails({
      ...userDetails,
      projects: [
        ...userDetails.projects,
        {
          name: "",
          description: "",
          link: "",
        },
      ],
    });
  };

  const addExperience = (e) => {
    setUserDetails({
      ...userDetails,
      experience: [
        ...userDetails.experience,
        {
          position: "",
          company: "",
          start: "",
          end: "",
        },
      ],
    });
  };

  const removeSkill = (e) => {
    e.preventDefault();

    const value = e.currentTarget.parentElement.children[0].innerText;

    let updatedSkills = userDetails.skills.filter((skill) => skill != value);
    setUserDetails({ ...userDetails, skills: updatedSkills });
  };

  const removeRole = (e) => {
    const value = e.currentTarget.parentElement.children[0].innerText;

    let updatedRoles = userDetails.roles.filter((role) => role != value);
    setUserDetails({ ...userDetails, roles: updatedRoles });
  };

  const removeItem = (e) => {
    let array = [];
    let source = e.currentTarget.id.split("-")[2];

    for (let i = 0; i < userDetails[source].length; i++) {
      if (i == e.currentTarget.id[0]) continue;

      array.push(userDetails[source][i]);
    }

    setUserDetails({ ...userDetails, [source]: array });
  };

  const handleProfilePhotoUpload = async (e) => {
    e.preventDefault();
    await deleteProfilePhoto();

    const file = document.querySelector("#photo").files[0];
    if (!file) return;

    const storageRef = ref(storage, `${user.uid}/profilePhoto/${file.name}`);
    uploadBytes(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            setUserDetails((prevState) => ({
              ...prevState,
              profilePhoto: url,
            }));
            setUserDetails((prevState) => ({
              ...prevState,
              imageName: file.name,
            }));
            document.querySelector("#photo").value = "";
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.log(err));
  };

  const handleResumeUpload = async (e) => {
    await deleteResume();

    const file = document.querySelector("#resume").files[0];
    if (!file) return;

    const storageRef = ref(storage, `${user.uid}/resume/${file.name}`);
    uploadBytes(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            setUserDetails((prevState) => ({
              ...prevState,
              resume: url,
            }));
            setUserDetails((prevState) => ({
              ...prevState,
              resumeName: file.name,
            }));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.log(err));
  };

  const deleteResume = async (e) => {
    const storageRef = ref(
      storage,
      `${user.uid}/resume/${userDetails.resumeName}`
    );

    deleteObject(storageRef)
      .then(() => {
        setUserDetails({ ...userDetails, resume: "" });
        document.querySelector("#resume").value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteProfilePhoto = async (e) => {
    const storageRef = ref(
      storage,
      `${user.uid}/profilePhoto/${userDetails.imageName}`
    );

    deleteObject(storageRef)
      .then(() => {
        setUserDetails({ ...userDetails, profilePhoto: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createProfile = async (e) => {
    e.preventDefault();

    if (
      !userDetails.name ||
      !userDetails.bio ||
      !userDetails.degree ||
      !userDetails.schoolYear ||
      !userDetails.institution ||
      !userDetails.graduationYear ||
      !userDetails.highSchool ||
      !userDetails.jobType ||
      !userDetails.roles.length
    ) {
      window.alert("Enter details in all required (*) fields");
    } else {
      setUserDetails({
        ...userDetails,
        hasExperience: userDetails.experience.length > 0,
      });
      setUserDetails({
        ...userDetails,
        hasPersonalWebsite: userDetails.portfolio != "",
      });
      setUserDetails({
        ...userDetails,
        hasProjects: userDetails.projects.length > 0,
      });

      await setDoc(doc(db, "candidates", user.uid), userDetails);
      router.push({ pathname: "/candidates/jobs" });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setUserDetails({ ...userDetails, name: user.displayName });
    }
  }, [user, loading]);

  useEffect(() => {
    switch (userDetails.schoolYear) {
      case "🐣Undergraduate":
      case "🐥Postgraduate":
        setUserDetails({ ...userDetails, currentlyStudying: true });
        break;
      case "🐔Alumni":
        setUserDetails({ ...userDetails, currentlyStudying: false });
        break;
    }
  }, [userDetails.schoolYear]);

  useEffect(() => {
    if (query) {
      setUserDetails(JSON.parse(query.data));
    }
  }, []);

  return (
    <div className={jobFormStyles.container}>
 
      <form className={utilityStyles.form}>
        <section>
          <h2>{"Let's get started"}</h2>
          <div className={`${utilityStyles.fieldContainer}`}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="name" className={utilityStyles.required}>
                Name
              </label>
              <small>Your first and lastname </small>
            </div>

            <input
              className={utilityStyles.roundOut}
              type="text"
              name="name"
              id="name"
              onChange={handleChangeForInput}
              value={userDetails.name}
            />
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={`${utilityStyles.labelContainer}`}>
              <label htmlFor="bio" className={utilityStyles.required}>
                Bio
              </label>
              <small>Tell your story. Try to keep it short</small>
            </div>

            <textarea
              maxLength={200}
              className={utilityStyles.roundOut}
              name="bio"
              id="bio"
              onChange={handleChangeForInput}
              value={userDetails.bio}
            />
          </div>
          <div className={`${utilityStyles.fieldContainer}`}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="location" className={utilityStyles.required}>
                Location
              </label>
              {/* <small>Your location</small> */}
            </div>

            <input
              className={utilityStyles.roundOut}
              type="text"
              name="location"
              id="location"
              onChange={handleChangeForInput}
              placeholder="City, Province"
              value={userDetails.location}
            />
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="gender">Sex</label>
              <small>
                Will be beneficial in the case that companies are looking to
                diversify their team. For example looking to employ more women.
              </small>
            </div>

            <CustomSelect
              title="Select"
              name="sex"
              stateTracker={showSex}
              setStateTracker={setShowSex}
              onChangeHandler={handleChangeForSelect}
              options={["♂️ Male", "♀️ Female", "Prefer not to say"]}
              value={userDetails.sex}
            />
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="photo">Profile photo</label>
              <small>A photo of your pretty face {":)"}</small>
            </div>
            <div className={utilityStyles.fileInputContainer}>
              <input
                type="file"
                name="photo"
                id="photo"
                className={utilityStyles.fileInput}
                onChange={handleProfilePhotoUpload}
              />
              {/* <button onClick={handleProfilePhotoUpload} id="profilePhoto">
                Upload
              </button> */}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {userDetails.profilePhoto == "" ? (
                <HiUserCircle size="90px" color="gray" />
              ) : (
                <Image
                  loader={() => userDetails.profilePhoto}
                  src={userDetails.profilePhoto}
                  alt="profile photo"
                  height={90}
                  width={90}
                  style={{
                    marginTop: "1rem",
                    marginRight: "1rem",
                    borderRadius: "50%",
                  }}
                />
              )}

              {userDetails.profilePhoto !== "" ? (
                <span onClick={deleteProfilePhoto}>
                  <MdCancel />
                </span>
              ) : null}
            </div>
          </div>
        </section>
        <section>
          <h2>Education</h2>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="degree" className={utilityStyles.required}>
                Degree
              </label>
            </div>
            <input
              className={utilityStyles.roundOut}
              type="text"
              name="degree"
              id="degree"
              onChange={handleChangeForInput}
              value={userDetails.degree}
            />
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="schoolYear" className={utilityStyles.required}>
                School year
              </label>
            </div>
            <CustomSelect
              title="Select"
              name="schoolYear"
              stateTracker={showSchoolYears}
              setStateTracker={setShowSchoolYears}
              onChangeHandler={handleChangeForSelect}
              options={["🐣Undergraduate", "🐥Postgraduate", "🐔Alumni"]}
              value={userDetails.schoolYear}
            />
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="institution" className={utilityStyles.required}>
                Institution
              </label>
              <small>
                The tertiary institution that you{" "}
                {userDetails.currentlyStudying ? "are studying " : "studied "}at{" "}
                {"(university, college, bootcamp)"}
              </small>
            </div>
            <input
              className={utilityStyles.roundOut}
              type="text"
              name="institution"
              id="institution"
              onChange={handleChangeForInput}
              value={userDetails.institution}
            />
          </div>

          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label
                htmlFor="graduationYear"
                className={utilityStyles.required}
              >
                Graduation Year
              </label>
              <small>
                The year that you{" "}
                {userDetails.currentlyStudying
                  ? "expect to graduate"
                  : "graduated"}
              </small>
            </div>

            <input
              className={utilityStyles.roundOut}
              type="number"
              name="graduationYear"
              id="graduationYear"
              onChange={handleChangeForInput}
              value={userDetails.graduationYear}
            />
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="highSchool" className={utilityStyles.required}>
                High school
              </label>
              <small>The high school that you attended</small>
            </div>
            <input
              className={utilityStyles.roundOut}
              type="text"
              name="highSchool"
              id="highSchool"
              onChange={handleChangeForInput}
              value={userDetails.highSchool}
            />
          </div>
        </section>
        <section>
          <h2>Courses</h2>
          <small
            style={{
              color: "rgb(56, 56, 56)",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Udemy courses, YouTube courses, MOOCS, Certifications, etc.
          </small>
          {userDetails.courses.map((element, idx) => {
            return (
              <Course
                key={`course${idx}`}
                index={idx}
                handleChange={handleChangeForMultiItems}
                removeItem={removeItem}
                userDetails={userDetails}
              />
            );
          })}
          <span onClick={addCourse}>
            <MdAddCircle size="2rem" />
          </span>
        </section>
        <section>
          <h2>Experience</h2>
          {userDetails.experience.map((element, idx) => {
            return (
              <Experience
                key={`experience${idx}`}
                index={idx}
                handleChange={handleChangeForMultiItems}
                removeItem={removeItem}
                userDetails={userDetails}
              />
            );
          })}
          <span onClick={addExperience}>
            <MdAddCircle size="2rem" />
          </span>
        </section>
        <section>
          <h2>Skills</h2>
          <small
            style={{
              color: "rgb(56, 56, 56)",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Include both technical and soft skills
          </small>
          <div className={utilityStyles.inputAndAddButton}>
            <input
              className={utilityStyles.roundOut}
              type="text"
              name="skills"
              id="skills"
            />
            <span onClick={addSkill} id="btn-skills">
              <MdAddCircle size="2rem" />
            </span>
          </div>

          <div
            style={{
              marginTop: "1rem",
              width: "250px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {userDetails.skills.map((skill, idx) => {
              return (
                <Item
                  key={`skill${idx}`}
                  skill={skill}
                  removeSkill={removeSkill}
                />
              );
            })}
          </div>
        </section>
        <section>
          <h2>Links</h2>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label>
                <BsLinkedin /> LinkedIn
              </label>
              <small>Your LinkedIn profile username</small>
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="linkedIn"
                id="linkedIn"
                onChange={handleChangeForInput}
                value={userDetails.linkedIn}
              />
            </div>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label>
                <BsGithub /> GitHub
              </label>
              <small>Your GitHub profile username</small>
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="gitHub"
                id="gitHub"
                onChange={handleChangeForInput}
                value={userDetails.gitHub}
              />
            </div>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label>
                <BsTwitter /> Twitter
              </label>
              <small>Your Twitter profile username</small>
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="twitter"
                id="twitter"
                onChange={handleChangeForInput}
                value={userDetails.twitter}
              />
            </div>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label>
                <BsYoutube /> YouTube
              </label>
              <small>Your YouTube profile handle</small>
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="youTube"
                id="youTube"
                onChange={handleChangeForInput}
                value={userDetails.youTube}
              />
            </div>
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label>
                <BsLink45Deg /> Portfolio website
              </label>
              <small>Your portfolio site</small>
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="portfolio"
                id="portfolio"
                onChange={handleChangeForInput}
                value={userDetails.portfolio}
              />
            </div>
          </div>
        </section>
        <section>
          <h2>Desired Roles</h2>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="jobType" className={utilityStyles.required}>
                Job Type
              </label>
            </div>
            <CustomSelect
              title="💼Select"
              name="jobType"
              stateTracker={showJobType}
              setStateTracker={setShowJobType}
              onChangeHandler={handleChangeForSelect}
              options={["🕛Full-time", "🕧Part-time", "⌚Internship"]}
              value={userDetails.jobType}
            />
          </div>
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="jobType" className={utilityStyles.required}>
                Roles {"you're"} interested in
              </label>
              <small>
                Enter the titles of jobs that your are interested in. For
                example front end developer, software engineer, etc.
              </small>
            </div>
            <div className={utilityStyles.inputAndAddButton}>
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="roles"
                id="roles"
              />
              <span onClick={addRole} id="btn-roles">
                <MdAddCircle size="2rem" />
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: "1rem",
              width: "300px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {userDetails.roles.map((role, idx) => {
              return (
                <Item
                  key={`role${idx}`}
                  skill={role}
                  removeSkill={removeRole}
                />
              );
            })}
          </div>
        </section>
        <section>
          <h2>Projects</h2>
          <small style={{ marginBottom: "1rem", textAlign: "center" }}>
            Show off any projects {"you've"} worked on {":)"}
          </small>
          {userDetails.projects.map((element, idx) => {
            return (
              <Project
                key={`project${idx}`}
                index={idx}
                handleChange={handleChangeForMultiItems}
                removeItem={removeItem}
                userDetails={userDetails}
              />
            );
          })}
          <span onClick={addProject}>
            <MdAddCircle size="2rem" />
          </span>
        </section>
        <section>
          <h2>Documents</h2>
          <div className={utilityStyles.fieldContainer}>
            <div
              className={utilityStyles.labelContainer}
              style={{ marginTop: "0" }}
            >
              <label htmlFor="resume">Resume</label>
              <small>PDF file of your resume</small>
            </div>
            <div className={utilityStyles.fileInputContainer}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  className={utilityStyles.fileInput}
                  onChange={handleResumeUpload}
                />
                {userDetails.resume ? (
                  <Item
                    skill={userDetails.resumeName}
                    removeSkill={deleteResume}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
        <button style={{ marginTop: "2rem" }} onClick={createProfile}>
          {query? "Save changes" : "Create profile"}
        </button>
      </form>
    </div>
  );
};

const Item = ({ skill, removeSkill }) => {
  return (
    <div
      className={utilityStyles.roundOut}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "12px",
        maxWidth: "fit-content",
        margin: ".5em",
        marginLeft: "0",
      }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          marginRight: ".5em",
        }}
      >
        <b>{skill}</b>
      </span>
      <span
        onClick={removeSkill}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
        }}
      >
        <MdCancel />
      </span>
    </div>
  );
};

const Project = ({ index, handleChange, removeItem, userDetails }) => {
  return (
    <div id={`${index}-projects`} className={utilityStyles.fieldContainer}>
      <div>
        <div className={createProfileStyles.projects}>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name="name"
            id="name"
            placeholder="Name of the project"
            onChange={handleChange}
            value={userDetails.projects[index]["name"]}
          />

          <textarea
            className={utilityStyles.roundOut}
            name="description"
            id="description"
            placeholder="Description"
            onChange={handleChange}
            value={userDetails.projects[index]["description"]}
            style={{ marginTop: ".5rem" }}
          />

          <input
            className={utilityStyles.roundOut}
            type="text"
            name="link"
            id="link"
            placeholder="Link to project"
            onChange={handleChange}
            value={userDetails.projects[index]["link"]}
            style={{ margin: ".5rem 0 1rem 0" }}
          />
        </div>
      </div>

      <span id={`${index}-rem-projects`} onClick={removeItem}>
        <MdCancel size="2rem" />
      </span>
    </div>
  );
};

const Course = ({ index, handleChange, removeItem, userDetails }) => {
  return (
    <div id={`${index}-courses`} className={createProfileStyles.experience}>
      <div>
        <div style={{ marginBottom: "1em" }}>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name="courseName"
            id="courseName"
            placeholder="Name of the course"
            onChange={handleChange}
            value={userDetails.courses[index]["courseName"]}
          />
          <span style={{ margin: "0 1em" }}>by</span>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name={`courseInstitution`}
            id={`courseInstitution`}
            placeholder="Creator of the course"
            onChange={handleChange}
            value={userDetails.courses[index]["courseInstitution"]}
          />
        </div>
        <div>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name={`start`}
            id={`start`}
            placeholder="From"
            onChange={handleChange}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            value={userDetails.courses[index]["start"]}
          />
          <span style={{ margin: "0 1em" }}>to</span>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name={`end`}
            id={`end`}
            placeholder="To"
            onChange={handleChange}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            value={userDetails.courses[index]["end"]}
          />
        </div>
        <div>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name="linkToCourse"
            id="linkToCourse"
            placeholder="Link to course"
            onChange={handleChange}
            value={userDetails.courses[index]["linkToCourse"]}
            style={{ margin: "1rem 0" }}
          />
        </div>
      </div>
      <span id={`${index}-rem-courses`} onClick={removeItem}>
        <MdCancel size="2rem" />
      </span>
    </div>
  );
};

const Experience = ({ index, handleChange, removeItem, userDetails }) => {
  return (
    <div id={`${index}-experience`} className={createProfileStyles.experience}>
      <div>
        <div style={{ marginBottom: "1em" }}>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name="position"
            id="position"
            placeholder="Position"
            onChange={handleChange}
            value={userDetails.experience[index]["position"]}
          />
          <span style={{ margin: "0 1em" }}>at</span>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name={`company`}
            id={`company`}
            placeholder="Company"
            onChange={handleChange}
            value={userDetails.experience[index]["company"]}
          />
        </div>
        <div>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name={`start`}
            id={`start`}
            placeholder="From"
            onChange={handleChange}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            value={userDetails.experience[index]["start"]}
          />
          <span style={{ margin: "0 1em" }}>to</span>
          <input
            className={utilityStyles.roundOut}
            type="text"
            name={`end`}
            id={`end`}
            placeholder="To"
            onChange={handleChange}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            value={userDetails.experience[index]["end"]}
          />
        </div>
      </div>
      <span
        id={`${index}-rem-experience`}
        onClick={removeItem}
        style={{ marginTop: "1rem" }}
      >
        <MdCancel size="2rem" />
      </span>
    </div>
  );
};

export default CreateCandidateProfile;