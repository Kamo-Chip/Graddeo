import { useEffect, useState } from "react";
import JobCard from "../../components/JobCard";
import jobFormStyles from "../../styles/jobForm.module.css";
import postJobStyles from "../../styles/postJob.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import profileStyles from "../../styles/profile.module.css";
import createProfileStyles from "../../styles/createProfile.module.css";
import { MdCancel } from "react-icons/md";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  capitaliseFirst,
  formatLink,
  formatTextRemoveSpaces,
} from "../../lib/format";
import { useRouter } from "next/router";
import CustomSelect from "../../components/CustomSelect";
import CustomSearch from "../../components/CustomSearch";
import CustomTextArea from "../../components/CustomTextArea";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  benefits,
  jobTypes,
  salaryTypes,
  durations,
} from "../../lib/filterOptions.json";
import FieldContainer from "../../components/FieldContainer";
import { v1 as uuidv1 } from "uuid";
import Image from "next/image";
import { HiUser, HiUserCircle } from "react-icons/hi";
import { checkLink } from "../../lib/format";

const JobForm = () => {
  const [jobDetails, setJobDetails] = useState({
    companyName: "",
    position: "",
    jobType: "",
    benefits: [],
    skills: [],
    location: "",
    salary: "",
    description: "",
    applicationURL: "",
    applicationEmail: "",
    companyLogo: "",
    hasCustomBackground: false,
    background: "var(--color-4)",
    datePosted: null,
    jobId: "",
    duration: "",
    jobStartDate: "",
    jobEndDate: "",
    deadline: "",
    salaryType: "",
    remoteOk: false,
    authorisation: false,
    canSponsor: false,
    openToTalk: false,
    hiringManager: {},
  });

  const [isDone, setIsDone] = useState(false);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [companyDetails, setCompanyDetails] = useState({});

  const handleChangeInput = (e) => {
    switch (e.target.id) {
      case "deadline":
      case "jobEndDate":
      case "jobStartDate":
        setJobDetails({
          ...jobDetails,
          [e.target.id]: Timestamp.fromDate(new Date(e.target.value)),
        });
        break;
      default:
        setJobDetails({ ...jobDetails, [e.target.id]: e.target.value });
    }
  };

  const handleChangeSelect = (e) => {
    const value = e.target.innerText;
    const source = e.target.parentElement.parentElement.id;

    switch (source) {
      case "benefits":
        if (!jobDetails.benefits.includes(value)) {
          setJobDetails({
            ...jobDetails,
            benefits: [...jobDetails.benefits, value],
          });
        }
        break;
      default:
        document.querySelector(`#${source}Title`).innerText = value;
        setJobDetails({ ...jobDetails, [source]: value });
    }
  };

  const handleChangeSearch = (e) => {
    const source = e.currentTarget.id.split("-")[1];
    const value = capitaliseFirst(
      e.currentTarget.parentElement.children[0].value
    );

    if (value) {
      e.currentTarget.parentElement.children[0].value = "";
      switch (source) {
        case "skills":
          if (!jobDetails.skills.includes(value)) {
            setJobDetails({
              ...jobDetails,
              skills: [...jobDetails.skills, value],
            });
          }
          break;
      }
    }
  };

  const removeJobListItem = (e) => {
    const source = e.currentTarget.id.split("-")[1];
    const value = e.currentTarget.parentElement.children[0].innerText;

    let newList = jobDetails[source].filter((item) => item != value);
    setJobDetails({ ...jobDetails, [source]: newList });
  };

  const getCompanyDetails = async () => {
    const res = await getDoc(doc(db, "companies", user.uid));
    let company = res.data();
    setCompanyDetails(company);
    setJobDetails({
      ...jobDetails,
      companyLogo: company.logo,
      companyName: company.name,
    });
  };

  const removeBenefit = (e) => {
    let value = e.currentTarget.parentElement.children[0].innerText;
    let newBenefits = jobDetails.benefits.filter(
      (benefit) => benefit !== value
    );
    setJobDetails({ ...jobDetails, benefits: newBenefits });
  };

  const toggleCustomBackground = (e) => {
    switch (e.target.id) {
      case "bg-1":
        if (e.target.checked) {
          document.querySelector("#bg-2").checked = false;
          setJobDetails({ ...jobDetails, background: "#fff38f" });
        } else {
          setJobDetails({ ...jobDetails, background: "#fff" });
        }
        break;
      case "bg-2":
        if (e.target.checked) {
          document.querySelector("#bg-1").checked = false;
          setJobDetails({
            ...jobDetails,
            hasCustomBackground: true,
            background: "#fff",
          });
        } else {
          setJobDetails({
            ...jobDetails,
            background: "#fff",
            hasCustomBackground: false,
          });
        }
        break;
    }
  };

  const changeBackground = (e) => {
    setJobDetails({ ...jobDetails, background: e.target.value });
  };

  const inputIsValid = () => {
    let isValid = false;
    if (
      (jobDetails.position &&
        jobDetails.jobType &&
        jobDetails.duration &&
        jobDetails.benefits.length &&
        jobDetails.skills.length &&
        jobDetails.description &&
        jobDetails.salary &&
        jobDetails.salaryType &&
        jobDetails.location &&
        jobDetails.deadline &&
        jobDetails.applicationEmail) ||
      jobDetails.applicationURL
    ) {
      isValid = true;
    }
    return isValid;
  };

  const linksAreValid = () => {
    return checkLink(jobDetails.applicationURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(jobDetails);
    let valid = inputIsValid();
    let durationIsValid = true;
    let openToTalkIsValid = true;

    if (jobDetails.duration.includes("Temporary")) {
      durationIsValid =
        !isNaN(jobDetails.jobStartDate.seconds) &&
        !isNaN(jobDetails.jobEndDate.seconds);
    }

    if (jobDetails.openToTalk) {
      openToTalkIsValid = jobDetails.hiringManager.name != "";
    }

    if (!valid || !durationIsValid || !openToTalkIsValid) {
      window.alert("Fill in all required (*) fields");
    } else if (!linksAreValid()) {
      window.alert("Format links correctly as indicated");
    } else {
      let options = {
        msecs: new Date().getTime(),
      };

      setJobDetails((prevDetails) => ({
        ...prevDetails,
        datePosted: Timestamp.now(),
        industry: companyDetails.industry,
        companyId: user.uid,
        jobId:
          formatLink(jobDetails.companyName + jobDetails.position) +
          uuidv1(options),
      }));

      setIsDone(true);
    }
    //console.log(valid);
  };

  const selectHiringManager = (e) => {
    const source = e.currentTarget;
    const id = e.currentTarget.id.split("-")[1];
    if (companyDetails.team[id] != jobDetails.hiringManager) {
      if (document.querySelector(`.${postJobStyles.selected}`)) {
        document
          .querySelector(`.${postJobStyles.selected}`)
          .classList.remove(postJobStyles.selected);
        source.classList.add(postJobStyles.selected);
      } else {
        source.classList.add(postJobStyles.selected);
      }
      setJobDetails({ ...jobDetails, hiringManager: companyDetails.team[id] });
    } else if (companyDetails.team[id] == jobDetails.hiringManager) {
      source.classList.remove(postJobStyles.selected);
      setJobDetails({ ...jobDetails, hiringManager: {} });
    }
  };

  const addJob = async () => {
    let jobRef = await addDoc(collection(db, "jobs"), jobDetails);
    let res = await getDoc(doc(db, "companies", user.uid));
    let company = res.data();
    let jobs = company.jobs;
    jobs.push(jobRef.id);
    await updateDoc(doc(db, "companies", user.uid), {
      jobs: jobs,
    });
    await updateDoc(doc(db, "jobs", jobRef.id), {
      jobId: jobRef.id,
    });
  };

  useEffect(() => {
    if (isDone) {
      console.log(jobDetails);

      addJob();
      router.push("/companies/candidate-list");
    }
  }, [isDone]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    }
    if (user) {
      getCompanyDetails();
    }
  }, [loading, user]);

  return (
    <div className={utilityStyles.containerFlex}>
      <div className={utilityStyles.form} style={{ paddingTop: "2rem" }}>
        <section className={utilityStyles.formSection}>
          {/* <h2>Job</h2> */}
          <FieldContainer
            name="position"
            required={true}
            label="Position"
            fieldType={
              <input
                className={utilityStyles.input}
                type="text"
                name="position"
                id="position"
                onChange={handleChangeInput}
                style={{ marginLeft: ".5rem" }}
              />
            }
          />
          <FieldContainer
            name="jobType"
            required={true}
            label="Job type"
            fieldType={
              <CustomSelect
                name="jobType"
                title="💼Job type"
                onChangeHandler={handleChangeSelect}
                options={jobTypes}
              />
            }
          />
          <FieldContainer
            name="duration"
            label="Duration"
            required={true}
            fieldType={
              <CustomSelect
                name="duration"
                title="⌛Duration"
                onChangeHandler={handleChangeSelect}
                options={durations}
              />
            }
          />
          {jobDetails.duration.includes("Temporary") ? (
            <div
              className={postJobStyles.fieldExtension}
              style={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
              }}
            >
              <input
                type="text"
                name="jobStartDate"
                id="jobStartDate"
                className={utilityStyles.input}
                style={{ margin: ".5em", width: "180px" }}
                placeholder="Start date"
                onChange={handleChangeInput}
                onClick={(e) => {
                  e.target.type = "date";
                }}
              />
              <input
                type="text"
                name="jobEndDate"
                id="jobEndDate"
                className={utilityStyles.input}
                style={{ margin: ".5rem", width: "180px" }}
                placeholder="End date"
                onChange={handleChangeInput}
                onClick={(e) => {
                  e.target.type = "date";
                }}
              />
            </div>
          ) : null}
          <FieldContainer
            name="benefits"
            required={true}
            label="Benefits"
            fieldType={
              <CustomSelect
                name="benefits"
                onChangeHandler={handleChangeSelect}
                title="🪅Benefits"
                options={benefits}
              />
            }
          />
          <div
            className={`${postJobStyles.fieldExtension}`}
            style={{
              marginTop: "1em",
              marginLeft: ".5rem",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {jobDetails.benefits
              ? jobDetails.benefits.map((benefit, idx) => {
                  return (
                    <div
                      key={`benefit${idx}`}
                      className={utilityStyles.itemBar}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        fontSize: "12px",
                        maxWidth: "fit-content",
                        margin: ".5em",
                        marginLeft: "0",
                        backgroundColor: "#fff",
                      }}
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          marginRight: ".5em",
                        }}
                      >
                        <b>{benefit}</b>
                      </span>
                      <span
                        onClick={removeBenefit}
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
                })
              : null}
          </div>
          <FieldContainer
            name="skills"
            required={true}
            label="Skills"
            smallText="The skills required for the job. Mention both soft
            and technical skills"
            fieldType={
              <CustomSearch
                name="skills"
                title="Enter skill"
                method={handleChangeSearch}
                emoji="🤹"
              />
            }
          />
          <div
            className={postJobStyles.fieldExtension}
            style={{
              marginTop: "1em",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {jobDetails.skills
              ? jobDetails.skills.map((skills, idx) => {
                  return (
                    <div
                      key={`skills${idx}`}
                      className={utilityStyles.itemBar}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        fontSize: "12px",
                        maxWidth: "fit-content",
                        margin: ".5em",
                        marginLeft: "0",
                        backgroundColor: "var(--color-5)",
                        color: "#fff",
                      }}
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          marginRight: ".5em",
                        }}
                      >
                        {skills}
                      </span>
                      <span
                        id="rem-skills"
                        onClick={removeJobListItem}
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
                })
              : null}
          </div>
          <FieldContainer
            name="description"
            required={true}
            label="Description"
            fieldType={
              <CustomTextArea
                maxLength={800}
                name="description"
                handler={handleChangeInput}
                value={jobDetails.description}
                height="250px"
              />
            }
          />

          <FieldContainer
            name="salary"
            label="Salary"
            smallText="Posts that specify a salary get a higher number of applications"
            fieldType={
              <input
                className={utilityStyles.input}
                type="number"
                name="salary"
                id="salary"
                onChange={handleChangeInput}
                style={{ marginLeft: ".5rem" }}
              />
            }
          />
          <div className={postJobStyles.fieldExtension}>
            <CustomSelect
              name="salaryType"
              onChangeHandler={handleChangeSelect}
              title="💵Salary Type"
              options={salaryTypes}
            />
          </div>
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
                placeholder="City, Province"
                onChange={handleChangeInput}
                style={{ marginLeft: ".5rem" }}
              />
            }
          />
          <div className={postJobStyles.fieldExtension}>
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: "1rem",
                marginLeft: ".5rem",
              }}
            >
              <input
                type="checkbox"
                id="remoteOK"
                style={{ width: "fit-content" }}
                onClick={(e) => {
                  setJobDetails({
                    ...jobDetails,
                    remoteOk: e.target.checked,
                  });
                }}
              />
              <span>Allow remote workers</span>
            </span>
          </div>
          <div className={`${utilityStyles.fieldContainer}`}>
            <div className={utilityStyles.labelContainer}>
              <label
                htmlFor="authorisation"
                className={`${utilityStyles.required} ${utilityStyles.headerTextNSmall}`}
              >
                Authorisation
              </label>
              <small className={utilityStyles.grayedOutText}></small>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                name="authorisation"
                id="authorisation"
                style={{ width: "fit-content", marginLeft: ".5rem" }}
                onClick={(e) => {
                  setJobDetails({
                    ...jobDetails,
                    authorisation: e.target.checked,
                  });
                }}
              />
              <span style={{ whiteSpace: "nowrap" }}>
                Requires S.A work visa
              </span>
            </div>
            {jobDetails.authorisation ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  name="canSponsor"
                  id="canSponsor"
                  style={{ width: "fit-content", marginLeft: ".5rem" }}
                  onClick={(e) => {
                    setJobDetails({
                      ...jobDetails,
                      canSponsor: e.target.checked,
                    });
                  }}
                />
                <span>You can sponsor a work visa</span>
              </div>
            ) : null}
          </div>
          <FieldContainer
            name="deadLine"
            required={true}
            label="Application deadline"
            fieldType={
              <input
                className={utilityStyles.input}
                type="date"
                name="deadline"
                id="deadline"
                onChange={handleChangeInput}
                style={{ marginLeft: ".5rem" }}
              />
            }
          />
          <div className={`${utilityStyles.fieldContainer}`}>
            <div className={utilityStyles.labelContainer}>
              <label
                htmlFor="openToTalk"
                className={`${utilityStyles.required} ${utilityStyles.headerTextNSmall}`}
              >
                Open to talk
              </label>
              <small className={utilityStyles.grayedOutText}>
                Are you open to speaking with interested candidates? Select the
                hiring manager of this job post
              </small>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                name="openToTalk"
                id="openToTalk"
                style={{ width: "fit-content", marginLeft: ".5rem" }}
                onClick={(e) => {
                  setJobDetails({
                    ...jobDetails,
                    openToTalk: true,
                  });
                }}
              />
              Yes
              <input
                type="radio"
                name="openToTalk"
                id="openToTalk"
                style={{ width: "fit-content", marginLeft: ".5rem" }}
                onClick={(e) => {
                  setJobDetails({
                    ...jobDetails,
                    openToTalk: false,
                    hiringManager: {},
                  });
                }}
              />
              No
            </div>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {jobDetails.openToTalk
                ? companyDetails.team.map((member, index) => {
                    return (
                      <div
                        key={`member${index}`}
                        style={{
                          width: "140px",
                          cursor: "pointer",
                          margin: ".25rem",
                          paddingTop: "1em",
                        }}
                        onClick={selectHiringManager}
                        id={`hr-${index}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt="profile photo"
                              loader={() => member.image}
                              height={80}
                              width={80}
                              className={utilityStyles.profilePhoto}
                            />
                          ) : (
                            <HiUser size="80px" color="#000" />
                          )}
                          <span
                            style={{ textAlign: "center" }}
                            className={utilityStyles.headerTextNSmall}
                          >
                            {member.name}
                          </span>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <FieldContainer
            name="applicationURL"
            required={true}
            labelId="lbl-url"
            label="Application URL"
            smallText="Link to the application page for the job on your company's
  website"
            fieldType={
              <div
                className={utilityStyles.input}
                id="applicationURLContainer"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>http://</div>
                <input
                  className={utilityStyles.mergeInputWithDiv}
                  type="text"
                  name="applicationURL"
                  id="applicationURL"
                  onChange={handleChangeInput}
                  style={{ marginLeft: ".5rem" }}
                  readOnly={false}
                  onClick={(e) => {
                    e.target.readOnly = false;
                    e.target.parentElement.style.opacity = "1";
                    document
                      .querySelector("#lbl-url")
                      .classList.add(utilityStyles.required);
                    let email = document.querySelector("#applicationEmail");
                    document
                      .querySelector("#lbl-email")
                      .classList.remove(utilityStyles.required);
                    email.readOnly = true;
                    email.style.opacity = ".2";
                    email.value = "";
                    setJobDetails({ ...jobDetails, applicationEmail: "" });
                  }}
                />
              </div>
              // <div
              //   className={utilityStyles.roundOut}
              //   style={{
              //     display: "flex",
              //     flexDirection: "row",
              //     alignItems: "center",
              //   }}
              // >
              //   <div>http://</div>
              //   <input
              //     className={utilityStyles.roundOut}
              //     type="text"
              //     name="applicationURL"
              //     id="applicationURL"
              //     onChange={handleChangeInput}
              //     style={{ marginLeft: ".5rem" }}
              //     readOnly={false}
              //     onClick={(e) => {
              //       e.target.readOnly = false;
              //       e.target.style.opacity = "1";
              //       document
              //         .querySelector("#lbl-url")
              //         .classList.add(utilityStyles.required);
              //       let email = document.querySelector("#applicationEmail");
              //       document
              //         .querySelector("#lbl-email")
              //         .classList.remove(utilityStyles.required);
              //       email.readOnly = true;
              //       email.style.opacity = ".2";
              //       email.value = "";
              //       setJobDetails({ ...jobDetails, applicationEmail: "" });
              //     }}
              //   />
              // </div>
            }
          />
          <span style={{ marginTop: "1rem" }}>or</span>
          <FieldContainer
            name="applicationEmail"
            labelId="lbl-email"
            label="Application Email"
            smallText="Email address where job applications can be sent"
            fieldType={
              <input
                className={utilityStyles.input}
                type="text"
                name="applicationEmail"
                id="applicationEmail"
                onChange={handleChangeInput}
                readOnly={true}
                style={{
                  opacity: ".2",
                  marginLeft: ".5rem",
                  marginBottom: "1rem",
                }}
                onClick={(e) => {
                  e.target.readOnly = false;
                  e.target.style.opacity = "1";
                  document
                    .querySelector("#lbl-email")
                    .classList.add(utilityStyles.required);
                  let url = document.querySelector("#applicationURLContainer");
                  document
                    .querySelector("#lbl-url")
                    .classList.remove(utilityStyles.required);
                  url.children[1].readOnly = true;
                  url.style.opacity = ".2";
                  url.children[1].value = "";
                  setJobDetails({ ...jobDetails, applicationURL: "" });
                }}
              />
            }
          />
        </section>
        <section
          className={utilityStyles.formSection}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>Customise Job Post</h2>
          <div
            className={createProfileStyles.sizeInput}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className={jobFormStyles.customisations}>
              <label>Highlight your post in yellow</label>
              <input
                type="checkbox"
                id="bg-1"
                onClick={toggleCustomBackground}
              />
            </div>
            <div className={jobFormStyles.customisations}>
              <label>Highlight with your {"company's brand colour"}</label>
              <input
                type="checkbox"
                id="bg-2"
                onClick={toggleCustomBackground}
              />
            </div>
            {jobDetails.hasCustomBackground ? (
              <>
                <label htmlFor="background-color" className={utilityStyles.formButton} style={{marginTop: ".5rem"}}>Select colour</label>
                <input
                  type="color"
                  name="background-color"
                  id="background-color"
                  onChange={changeBackground}
                  className={utilityStyles.fileInput}
                />
              </>
            ) : null}
          </div>
        </section>
        <section
          className={utilityStyles.formSection}
          style={{ padding: "0 1em" }}
        >
          <h2>Preview job Post</h2>
          <JobCard job={jobDetails} />
        </section>
        <button onClick={handleSubmit} className={utilityStyles.formButton}>
          Post
        </button>
      </div>
    </div>
  );
};

export default JobForm;
