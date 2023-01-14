import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import utilityStyles from "../../styles/utilities.module.css";
import CustomSelect from "../../components/CustomSelect";
import { MdAddCircle, MdCancel, MdOutlineFileUpload } from "react-icons/md";
import createProfileStyles from "../../styles/createProfile.module.css";
import { db, storage } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import {
  BsLinkedin,
  BsGithub,
  BsTwitter,
  BsYoutube,
  BsLink45Deg,
  BsInstagram,
} from "react-icons/bs";
import Image from "next/image";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { HiUser } from "react-icons/hi";
import FieldContainer from "../../components/FieldContainer";
import {
  schoolYears,
  jobTypes,
  visaStatusses,
  sexes
} from "../../lib/filterOptions.json";
import { checkLink } from "../../lib/format";

const CreateCandidateProfile = () => {
  const [user, loading] = useAuthState(auth);
  const [userDetails, setUserDetails] = useState({
    name: "",
    bio: "",
    sex: "",
    email: "",
    profilePhoto: "",
    imageName: "",
    schoolYear: "",
    resume: "",
    resumeName: "",
    experience: [
      {
        position: "",
        company: "",
        start: "",
        end: "",
      },
    ],
    skills: [],
    roles: [],
    projects: [
      {
        name: "",
        description: "",
        link: "",
      },
    ],
    education: [
      {
        institution: "",
        educationLevel: "",
        major: "",
        graduationMonth: "",
        graduationYear: "",
      },
    ],
    jobType: "",
    portfolio: "",
    linkedIn: "",
    gitHub: "",
    twitter: "",
    youTube: "",
    location: "",
    visaStatus: "",
    bookmarkedJobs: [],
  });

  const [showSex, setShowSex] = useState(false);
  const [showJobType, setShowJobType] = useState(false);
  const [isDone, setIsDone] = useState(false);
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

  const handleChangeForEducation = (e) => {
    let tokens = "";
    let source = e.target.parentElement.parentElement.id;

    if (source == "educationLevel") {
      tokens =
        e.target.parentElement.parentElement.parentElement.parentElement.id.split(
          "-"
        );
    } else if (source == "graduationMonth") {
      tokens =
        e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id.split(
          "-"
        );
    } else if (source == "") {
      tokens = e.target.parentElement.parentElement.parentElement.id.split("-");
    } else {
      tokens = e.target.parentElement.parentElement.id.split("-");
    }

    let id = tokens[0];
    let source2 = tokens[1];

    let arr = [];

    arr = userDetails[source2];
    if (source != "graduationMonth" && source != "educationLevel") {
      arr[id][e.target.id] = e.target.value;
    } else {
      arr[id][e.target.parentElement.parentElement.id] = e.target.innerText;
    }

    if (arr[id].educationLevel == "High School") {
      arr[id].major = "";
      arr[id].graduationMonth = "";
    }

    console.log(arr);
    setUserDetails({ ...userDetails, [source2]: arr });
  };

  const handleChangeForMultiItems = (e) => {
    let tokens =
      e.target.parentElement.parentElement.parentElement.id.split("-");

    let id = tokens[0];
    let source = tokens[1];

    let arr = [];

    arr = userDetails[source];
    arr[id][e.target.id] = e.target.value;
    console.log(arr);
    setUserDetails({ ...userDetails, [source]: arr });
  };

  const addSkill = (e) => {
    let skill = document.querySelector("#skills").value.toUpperCase();
    document.querySelector("#skills").value = "";

    if (!userDetails.skills.includes(skill) && skill) {
      setUserDetails({
        ...userDetails,
        skills: [...userDetails.skills, skill],
      });
    }
  };

  const addRole = (e) => {
    let role = document.querySelector("#roles").value;
    document.querySelector("#roles").value = "";

    if (!userDetails.roles.includes(role) && role) {
      setUserDetails({
        ...userDetails,
        roles: [...userDetails.roles, role],
      });
    }
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

  const addEducation = () => {
    setUserDetails({
      ...userDetails,
      education: [
        ...userDetails.education,
        {
          institution: "",
          educationLevel: "",
          major: "",
          graduationMonth: "",
          graduationYear: "",
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

  const checkEducation = () => {
    let isValid = false;
    if (
      userDetails.education[0].institution &&
      userDetails.education[0].educationLevel &&
      userDetails.education[0].graduationYear &&
      userDetails.education[0].educationLevel == "High School"
    ) {
      isValid = true;
    } else if (
      userDetails.education[0].institution &&
      userDetails.education[0].educationLevel &&
      userDetails.education[0].graduationYear &&
      userDetails.education[0].educationLevel != "High School" &&
      userDetails.education[0].major &&
      userDetails.education[0].graduationMonth
    ) {
      isValid = true;
    }
    return isValid;
  };

  const inputIsValid = () => {
    let isValid = false;
    if (
      userDetails.name &&
      userDetails.bio &&
      userDetails.location &&
      userDetails.email &&
      userDetails.schoolYear &&
      userDetails.visaStatus &&
      checkEducation() &&
      userDetails.jobType &&
      userDetails.roles.length
    ) {
      isValid = true;
    }
    return isValid;
  };

  const linksAreValid = () => {
    return (
      checkLink(userDetails.gitHub) &&
      checkLink(userDetails.linkedIn) &&
      checkLink(userDetails.twitter) &&
      checkLink(userDetails.youTube) &&
      checkLink(userDetails.portfolio) &&
      checkLink(userDetails.instagram)
    );
  };

  const createProfile = async (e) => {
    e.preventDefault();
    console.log(userDetails);
    if (!inputIsValid()) {
      window.alert("Fill in all required (*) fields");
    } else if (!linksAreValid()) {
      window.alert("Format links correctly as indicated");
    } else {
      setUserDetails((prevState) => ({
        ...prevState,
        candidateId: user.uid,
      }));

      setIsDone(true);
    }
  };

  const addItemToCollection = async (item, collectionToAdd, id) => {
    await setDoc(doc(db, collectionToAdd, id), item);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/candidates");
    }
    if (user) {
      setUserDetails({
        ...userDetails,
        name: user.displayName,
        email: user.email,
      });
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
    if (isDone) {
      addItemToCollection(userDetails, "candidates", user.uid);
      router.push({ pathname: "/candidates/jobs" });
    }
  }, [isDone]);

  useEffect(() => {
    if (query.data) {
      setUserDetails(JSON.parse(query.data));
    }
  }, []);

  return (
    <div className={utilityStyles.containerFlex}>
      <form className={utilityStyles.form}>
        <section className={utilityStyles.formSection}>
          <h2> {query.data ? "Edit profile" : "Let's get started"}</h2>
          <FieldContainer
            name="name"
            required={true}
            label="Name"
            smallText="Your first and lastname"
            fieldType={
              <input
                className={utilityStyles.input}
                type="text"
                name="name"
                id="name"
                onChange={handleChangeForInput}
                defaultValue={
                  userDetails.name
                    ? userDetails.name
                    : !loading
                    ? user.displayName
                    : ""
                }
              />
            }
          />
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="photo">Profile photo</label>
              <small>Upload a photo of your pretty face {":)"}</small>
            </div>
            <div className={utilityStyles.fileInputContainer}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "120px",
                  height: "94px",
                }}
              >
                {userDetails.profilePhoto == "" ? (
                  <span
                    style={{
                      marginRight: "1rem",
                    }}
                  >
                    <HiUser size="90px" color="#000" />
                  </span>
                ) : (
                  <Image
                    loader={() => userDetails.profilePhoto}
                    src={userDetails.profilePhoto}
                    alt="profile photo"
                    height={90}
                    width={90}
                    style={{
                      marginRight: "1rem",
                    }}
                    className={utilityStyles.profilePhoto}
                  />
                )}
              </div>
              {userDetails.profilePhoto !== "" ? (
                <span
                  onClick={deleteProfilePhoto}
                  className={utilityStyles.formButton}
                >
                  Delete photo
                </span>
              ) : (
                <label
                  for="photo"
                  style={{ width: "fit-content" }}
                  className={utilityStyles.formButton}
                >
                  Upload photo
                </label>
              )}

              <input
                type="file"
                name="photo"
                id="photo"
                className={utilityStyles.fileInput}
                onChange={handleProfilePhotoUpload}
              />
            </div>
          </div>
          <FieldContainer
            name="bio"
            required={true}
            label="Bio"
            smallText="Tell your story. Try to keep it short"
            fieldType={
              <textarea
                maxLength={200}
                className={utilityStyles.input}
                name="bio"
                id="bio"
                onChange={handleChangeForInput}
                value={userDetails.bio}
              />
            }
          />
          <FieldContainer
            name="location"
            required={true}
            label="Location"
            fieldType={
              <input
                className={utilityStyles.input}
                type="text"
                name="location"
                id="location"
                onChange={handleChangeForInput}
                placeholder="City, Province"
                value={userDetails.location}
              />
            }
          />

          <FieldContainer
            name="email"
            required={true}
            label="Email"
            smallText="The email address where employers can contact you"
            fieldType={
              <input
                className={utilityStyles.input}
                type="email"
                name="email"
                id="email"
                onChange={handleChangeForInput}
                defaultValue={
                  userDetails.email
                    ? userDetails.email
                    : !loading
                    ? user.email
                    : ""
                }
              />
            }
          />
          <FieldContainer
            name="schoolYear"
            required={true}
            label="School year"
            smallText="Select the point where you currently are in your schooling career"
            fieldType={
              <CustomSelect
                title="Select"
                name="schoolYear"
                onChangeHandler={handleChangeForSelect}
                options={schoolYears}
                value={userDetails.schoolYear}
              />
            }
          />
          <FieldContainer
            name="visaStatus"
            required={true}
            label="Visa status"
            smallText="Is beneficial in the case that companies are looking to
            diversify their team by hiring foreigners. Also reduces friction by letting employers know your work eligibility ahead of time"
            fieldType={
              <CustomSelect
                title="Select"
                name="visaStatus"
                onChangeHandler={handleChangeForSelect}
                options={visaStatusses}
                value={userDetails.visaStatus}
              />
            }
          />
          <FieldContainer
            name="gender"
            label="Biological Sex"
            smallText="Will be beneficial in the case that companies are looking to
            diversify their team. For example looking to employ more women"
            fieldType={
              <CustomSelect
                title="Select"
                name="sex"
                stateTracker={showSex}
                setStateTracker={setShowSex}
                onChangeHandler={handleChangeForSelect}
                options={sexes}
                value={userDetails.sex}
              />
            }
          />
        </section>
        <section className={utilityStyles.formSection}>
          <h2>Education</h2>
          {userDetails.education.map((element, idx) => {
            return (
              <Education
                key={`education${idx}`}
                index={idx}
                handleChange={handleChangeForEducation}
                removeItem={removeItem}
                userDetails={userDetails}
              />
            );
          })}
          <div className={utilityStyles.fieldContainer}>
            <span
              className={utilityStyles.formButton}
              style={{ marginTop: "1rem", marginLeft: ".5rem" }}
              onClick={addEducation}
            >
              Add
            </span>
          </div>
        </section>

        <section className={utilityStyles.formSection}>
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
          <div className={utilityStyles.fieldContainer}>
            <span
              className={utilityStyles.formButton}
              style={{ marginLeft: ".5rem", marginTop: "1rem" }}
              onClick={addExperience}
            >
              Add
            </span>
          </div>
        </section>
        <section className={utilityStyles.formSection}>
          <h2>Skills</h2>

          <FieldContainer
            name="skills"
            label="Skills"
            smallText="Include both technical and soft skills"
            fieldType={
              <div className={utilityStyles.inputAndAddButton}>
                <input
                  className={utilityStyles.input}
                  type="text"
                  name="skills"
                  id="skills"
                />
                <span
                  onClick={addSkill}
                  id="btn-skills"
                  className={utilityStyles.formButton}
                >
                  Add
                </span>
              </div>
            }
          />
          <div
            className={createProfileStyles.fieldContainer}
            style={{
              marginTop: "1rem",
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
        <section className={utilityStyles.formSection}>
          <h2>Links</h2>
          <FieldContainer
            name="linkedIn"
            icon={<BsLinkedin />}
            label={" LinkedIn"}
            smallText="Your LinkedIn profile username"
            fieldType={
              <div
                className={utilityStyles.input}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://www.linkedin.com/in/</div>
                <input
                  className={utilityStyles.linkInput}
                  type="text"
                  name="linkedIn"
                  id="linkedIn"
                  onChange={handleChangeForInput}
                  value={userDetails.linkedIn}
                />
              </div>
            }
          />
          <FieldContainer
            name="gitHub"
            icon={<BsGithub />}
            label="GitHub"
            smallText="Your GitHub profile username"
            fieldType={
              <div
                className={utilityStyles.input}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://github.com/</div>
                <input
                  className={utilityStyles.linkInput}
                  type="text"
                  name="gitHub"
                  id="gitHub"
                  onChange={handleChangeForInput}
                  value={userDetails.gitHub}
                />
              </div>
            }
          />
          <FieldContainer
            name="instagram"
            icon={<BsInstagram />}
            label="Instagram"
            smallText="Your Instagram profile username"
            fieldType={
              <div
                className={utilityStyles.input}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://www.instagram.com/</div>
                <input
                  className={utilityStyles.linkInput}
                  type="text"
                  name="instagram"
                  id="instagram"
                  onChange={handleChangeForInput}
                  value={userDetails.instagram}
                />
              </div>
            }
          />
          <FieldContainer
            name="twitter"
            icon={<BsTwitter />}
            label="Twitter"
            smallText="Your Twitter profile username"
            fieldType={
              <div
                className={utilityStyles.input}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://twitter.com/</div>
                <input
                  className={utilityStyles.linkInput}
                  type="text"
                  name="twitter"
                  id="twitter"
                  onChange={handleChangeForInput}
                  value={userDetails.twitter}
                />
              </div>
            }
          />
          <FieldContainer
            name="youTube"
            icon={<BsYoutube />}
            label={"YouTube"}
            smallText="Your YouTube profile handle"
            fieldType={
              <div
                className={utilityStyles.input}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://www.youtube.com/@</div>
                <input
                  className={utilityStyles.linkInput}
                  type="text"
                  name="youTube"
                  id="youTube"
                  onChange={handleChangeForInput}
                  value={userDetails.youTube}
                />
              </div>
            }
          />
          <FieldContainer
            name="portfolio"
            icon={<BsLink45Deg />}
            label={"Portfolio website"}
            smallText="Your portfolio site"
            fieldType={
              <div
                className={utilityStyles.input}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>http://</div>
                <input
                  className={utilityStyles.linkInput}
                  type="text"
                  name="portfolio"
                  id="portfolio"
                  onChange={handleChangeForInput}
                  value={userDetails.portfolio}
                />
              </div>
            }
          />
        </section>
        <section className={utilityStyles.formSection}>
          <h2>Desired Roles</h2>
          <FieldContainer
            name="jobType"
            label="Job type"
            smallText="The type of job that you are looking for"
            required={true}
            fieldType={
              <CustomSelect
                title="💼Select"
                name="jobType"
                stateTracker={showJobType}
                setStateTracker={setShowJobType}
                onChangeHandler={handleChangeForSelect}
                options={jobTypes}
                value={userDetails.jobType}
              />
            }
          />
          <FieldContainer
            name="roles"
            label="Roles you're interested in"
            smallText="Enter the titles of jobs that you are interested in. For
            example front end developer, software engineer, etc."
            required={true}
            fieldType={
              <div className={utilityStyles.inputAndAddButton}>
                <input
                  className={utilityStyles.input}
                  type="text"
                  name="roles"
                  id="roles"
                />
                <span
                  onClick={addRole}
                  id="btn-roles"
                  className={utilityStyles.formButton}
                >
                  Add
                </span>
              </div>
            }
          />
          <div
            className={createProfileStyles.fieldContainer}
            style={{
              marginTop: "1rem",
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
        <section className={utilityStyles.formSection}>
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
          <div className={utilityStyles.fieldContainer}>
            <span
              className={utilityStyles.formButton}
              style={{ marginTop: "1rem", marginLeft: ".5rem" }}
              onClick={addProject}
            >
              Add
            </span>
          </div>
        </section>
        <section className={utilityStyles.formSection}>
          <h2>Documents</h2>
          <div className={utilityStyles.fieldContainer}>
            <div
              className={utilityStyles.labelContainer}
              style={{ marginTop: "0" }}
            >
              <label htmlFor="resume" className={utilityStyles.headerTextNSmall}>Resume</label>
              <small>PDF file of your resume</small>
            </div>
            <div className={utilityStyles.fileInputContainer}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {userDetails.resume ? (
                  <span
                    onClick={deleteResume}
                    className={utilityStyles.formButton}
                  >
                    Delete resume
                  </span>
                ) : (
                  <label
                    for="resume"
                    style={{ width: "fit-content" }}
                    className={utilityStyles.formButton}
                  >
                    Upload resume
                  </label>
                )}
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
        <button onClick={createProfile} className={utilityStyles.formButton}>
          {query.data ? "Save changes" : "Create profile"}
        </button>
      </form>
    </div>
  );
};

const Education = ({ index, handleChange, removeItem, userDetails }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      id={`${index}-education`}
    >
      <FieldContainer
        name="institution"
        required={true}
        label="Institution"
        fieldType={
          <input
            className={utilityStyles.input}
            type="text"
            name="institution"
            id="institution"
            onChange={handleChange}
            value={userDetails.education[index]["institution"]}
          />
        }
      />
      <FieldContainer
        name="educationLevel"
        required={true}
        label="Education level"
        fieldType={
          <CustomSelect
            title="Select"
            name="educationLevel"
            onChangeHandler={handleChange}
            options={[
              "High School",
              "Associates",
              "Certificate",
              "Bachelors",
              "Masters",
              "Doctorate",
            ]}
            value={userDetails.education[index]["educationLevel"]}
          />
        }
      />
      {userDetails.education[index].educationLevel == "Associates" ||
      userDetails.education[index].educationLevel == "Bachelors" ||
      userDetails.education[index].educationLevel == "Masters" ||
      userDetails.education[index].educationLevel == "Doctorate" ? (
        <FieldContainer
          name="major"
          required={true}
          label="Major"
          smallText="The main focus of your degree, e.g) Computer Science, Computer Engineering, Informatics, etc."
          fieldType={
            <input
              className={utilityStyles.input}
              type="text"
              name="major"
              id="major"
              onChange={handleChange}
              value={userDetails.education[index]["major"]}
            />
          }
        />
      ) : userDetails.education[index].educationLevel == "Certificate" ? (
        <FieldContainer
          name="major"
          required={true}
          label="Name"
          smallText="The name of the certification you obtained, e.g) Microsoft MTA"
          fieldType={
            <input
              className={utilityStyles.input}
              type="text"
              name="major"
              id="major"
              onChange={handleChange}
              value={userDetails.education[index]["major"]}
            />
          }
        />
      ) : null}

      <FieldContainer
        name="graduationYear"
        required={true}
        label="Graduation date"
        fieldType={
          <div style={{ display: "flex", flexDirection: "column" }}>
            {userDetails.education[index].educationLevel != "High School" ? (
              <CustomSelect
                name="graduationMonth"
                title="Month"
                onChangeHandler={handleChange}
                options={[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ]}
                value={userDetails.education[index]["graduationMonth"]}
              />
            ) : null}

            <input
              type="number"
              name="graduationYear"
              id="graduationYear"
              className={utilityStyles.input}
              style={{
                height: "38px",
                width: "180px",
                marginLeft: ".5rem",
                marginTop: ".5rem",
              }}
              placeholder="Year"
              onChange={handleChange}
              value={userDetails.education[index]["graduationYear"]}
            />
          </div>
        }
      />
      {index > 0 ? (
        <div className={utilityStyles.fieldContainer}>
          <span
            id={`${index}-rem-education`}
            className={utilityStyles.formButton}
            style={{ marginTop: "1rem", marginLeft: ".5rem" }}
            onClick={removeItem}
          >
            Remove
          </span>
        </div>
      ) : null}
    </div>
  );
};
const Item = ({ skill, removeSkill }) => {
  return (
    <div
      className={utilityStyles.itemBar}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "12px",
        color: "#fff",
        backgroundColor: "var(--color-5)",
        letterSpacing: ".75px"
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
    <div
      id={`${index}-projects`}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className={createProfileStyles.fieldExtension}>
        <div className={createProfileStyles.projects}>
          <input
            className={utilityStyles.input}
            type="text"
            name="name"
            id="name"
            placeholder="Name of the project"
            onChange={handleChange}
            value={userDetails.projects[index]["name"]}
          />

          <textarea
            className={utilityStyles.input}
            name="description"
            id="description"
            placeholder="Description"
            onChange={handleChange}
            value={userDetails.projects[index]["description"]}
            style={{ marginTop: "1rem" }}
          />
          <div
            className={utilityStyles.input}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <div>http://</div>
            <input
              className={utilityStyles.linkInput}
              type="text"
              name="link"
              id="link"
              onChange={handleChange}
              value={userDetails.projects[index]["link"]}
            />
          </div>
        </div>
      </div>
      <div className={utilityStyles.fieldContainer}>
        <span
          id={`${index}-rem-projects`}
          onClick={removeItem}
          className={utilityStyles.formButton}
          style={{ marginLeft: ".5rem", marginTop: "1rem" }}
        >
          Remove
        </span>
      </div>
    </div>
  );
};

const Experience = ({ index, handleChange, removeItem, userDetails }) => {
  return (
    <div
      id={`${index}-experience`}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "1rem",
      }}
    >
      <div className={createProfileStyles.fieldContainer}>
        <div
          className={createProfileStyles.experienceInputContainer}
          
        >
          <input
            className={utilityStyles.input}
            type="text"
            name="position"
            id="position"
            placeholder="Position"
            onChange={handleChange}
            value={userDetails.experience[index]["position"]}
            style={{ marginBottom: "1rem" }}
          />
          {/* <span style={{ margin: "0 1em" }}>@</span> */}
          <input
            className={utilityStyles.input}
            type="text"
            name={`company`}
            id={`company`}
            placeholder="Company"
            onChange={handleChange}
            value={userDetails.experience[index]["company"]}
            style={{ marginBottom: "1rem" }}
          />
        </div>
        <div className={createProfileStyles.experienceInputContainer}>
          <input
            className={utilityStyles.input}
            type="text"
            name={`start`}
            id={`start`}
            placeholder="Start date"
            onChange={handleChange}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            value={userDetails.experience[index]["start"]}
            style={{ marginBottom: "1rem" }}
          />
          {/* <span style={{ margin: "0 1em" }}>to</span> */}
          <input
            className={utilityStyles.input}
            type="text"
            name={`end`}
            id={`end`}
            placeholder="End date"
            onChange={handleChange}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            value={userDetails.experience[index]["end"]}
            style={{ marginBottom: "1rem" }}
          />
        </div>
      </div>

      <div className={utilityStyles.fieldContainer}>
        <span
          id={`${index}-rem-experience`}
          onClick={removeItem}
          style={{ marginLeft: ".5rem" }}
          className={utilityStyles.formButton}
        >
          Remove
        </span>
      </div>
    </div>
  );
};

export default CreateCandidateProfile;
