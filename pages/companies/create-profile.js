import utilityStyles from "../../styles/utilities.module.css";
import profileStyles from "../../styles/profile.module.css";
import CustomSelect from "../../components/CustomSelect";
import CustomTextArea from "../../components/CustomTextArea";
import { useEffect, useState } from "react";
import { HiUserCircle, HiUser } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
import Image from "next/image";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, storage } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addItemToCollection } from "../../lib/db";
import { useRouter } from "next/router";
import FieldContainer from "../../components/FieldContainer";
import {
  benefits,
  jobTypes,
  employeeCounts,
  industries,
} from "../../lib/filterOptions.json";
import {
  BsLinkedin,
  BsTwitter,
  BsInstagram,
  BsLink45Deg,
} from "react-icons/bs";
import { checkLink, formatTextRemoveSpaces } from "../../lib/format";

const CompanyCreateProfile = () => {
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    bio: "",
    employeeCount: "",
    location: "",
    email: "",
    logo: "",
    culture: "",
    whyUs: "",
    benefits: [],
    site: "",
    publicStatus: "",
    team: [],
    jobs: [],
    logoName: "",
    bookmarkedCandidates: [],
    prospectiveCandidates: [],
  });

  const [user, loading] = useAuthState(auth);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();
  const { query } = router;

  const handleChangeSelect = (e) => {
    const value = e.target.innerText;
    const source = e.target.parentElement.parentElement.id;
    document.querySelector(`#${source}Title`).innerText = value;

    setCompanyDetails({ ...companyDetails, [source]: value });
  };

  const handleChangeInput = (e) => {
    setCompanyDetails({ ...companyDetails, [e.target.id]: e.target.value });
  };

  const addBenefit = (e) => {
    if (!companyDetails.benefits.includes(e.target.innerText)) {
      setCompanyDetails({
        ...companyDetails,
        benefits: [...companyDetails.benefits, e.target.innerText],
      });
    }
  };

  const addTeamMember = async () => {
    let memberName = document.querySelector("#memberName").value;
    document.querySelector("#memberName").value = "";

    let memberEmail = document.querySelector("#memberEmail").value;
    document.querySelector("#memberEmail").value = "";

    let memberImg = "";

    let file = document.querySelector("#memberImg").files[0];
    document.querySelector("#memberImg").value = "";

    if (memberEmail && memberName) {
      if (file) {
        const storageRef = ref(storage, `${user.uid}/team/${file.name}`);
        uploadBytes(storageRef, file)
          .then(() => {
            getDownloadURL(storageRef)
              .then((url) => {
                memberImg = url;
                if (memberName) {
                  setCompanyDetails({
                    ...companyDetails,
                    team: [
                      ...companyDetails.team,
                      {
                        name: memberName,
                        email: memberEmail,
                        image: memberImg,
                        imgName: file.name,
                      },
                    ],
                  });
                }
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.log(err));
      } else {
        setCompanyDetails({
          ...companyDetails,
          team: [
            ...companyDetails.team,
            {
              name: memberName,
              email: memberEmail,
              image: memberImg,
              imgName: "",
            },
          ],
        });
      }
    }
  };

  const removeTeamMember = (e) => {
    let memberIndex = e.currentTarget.id.split("-")[1];

    let newMembers = [];

    companyDetails.team.forEach((member, index) => {
      if (index != memberIndex) {
        newMembers.push(member);
      } else {
        const storageRef = ref(storage, `${user.uid}/team/${member.imgName}`);
        deleteObject(storageRef).catch((err) => {
          console.log(err);
        });
      }
      setCompanyDetails({ ...companyDetails, team: newMembers });
    });
  };
  const deleteLogo = async () => {
    const storageRef = ref(
      storage,
      `${user.uid}/logo/${companyDetails.logoName}`
    );

    deleteObject(storageRef)
      .then(() => {
        setCompanyDetails({ ...companyDetails, logo: "", logoName: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogoUpload = async () => {
    await deleteLogo();

    const file = document.querySelector("#logo").files[0];
    if (!file) return;

    const storageRef = ref(storage, `${user.uid}/logo/${file.name}`);
    uploadBytes(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            setCompanyDetails((prevState) => ({
              ...prevState,
              logo: url,
              logoName: file.name,
            }));
            // setLogoName(file.name);
            document.querySelector("#logo").value = "";
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.log(err));
  };

  const removeBenefit = (e) => {
    const value = e.currentTarget.parentElement.children[0].innerText;
    let newBenefits = companyDetails.benefits.filter(
      (benefit) => benefit != value
    );
    setCompanyDetails({ ...companyDetails, benefits: newBenefits });
  };

  const inputIsValid = () => {
    let isValid = false;
    if (
      companyDetails.name &&
      companyDetails.bio &&
      companyDetails.employeeCount &&
      companyDetails.location &&
      companyDetails.email &&
      companyDetails.industry &&
      companyDetails.culture &&
      companyDetails.whyUs &&
      companyDetails.interviewProcess
    ) {
      isValid = true;
    }
    return isValid;
  };

  const linksAreValid = () => {
    return (
      checkLink(companyDetails.linkedIn) &&
      checkLink(companyDetails.twitter) &&
      checkLink(companyDetails.instagram) &&
      checkLink(companyDetails.site)
    );
  };

  const createProfile = (e) => {
    e.preventDefault();
    console.log(companyDetails);

    if (!inputIsValid()) {
      window.alert("Fill in all required (*) fields");
    } else if (!linksAreValid()) {
      window.alert("Format links correctly as indicated");
    } else {
      setCompanyDetails((prevState) => ({
        ...prevState,
        companyId: user.uid,
      }));

      setIsDone(true);
    }
  };

  useEffect(() => {
    if (isDone) {
      addItemToCollection(companyDetails, "companies", user.uid);
      console.log(companyDetails);
      router.push({ pathname: "/companies/candidate-list" });
    }
  }, [isDone]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    }
    if (user) {
      setCompanyDetails({
        ...companyDetails,
        email: user.email,
      });
    }
  }, [loading, user]);

  useEffect(() => {
    if (query.data) {
      setCompanyDetails(JSON.parse(query.data));
    }
  }, []);

  return (
    <div className={utilityStyles.containerFlex}>
      <div className={utilityStyles.form}>
        <section
          className={utilityStyles.formSection}
          style={{ paddingBottom: "1.5rem" }}
        >
          <h2>{query.data ? "Edit profile" : "Let's get started"}</h2>

          <FieldContainer
            name="name"
            required={true}
            label="Company name"
            fieldType={
              <input
                className={utilityStyles.input}
                type="text"
                name="name"
                id="name"
                onChange={handleChangeInput}
                value={companyDetails.name}
              />
            }
          />

          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label
                htmlFor="company logo"
                className={utilityStyles.headerTextNSmall}
              >
                Logo
              </label>
              <small>Upload photo of your {"company's logo"}</small>
            </div>
            <div className={utilityStyles.fileInputContainer}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "120px",
                  height: "94px",
                  marginLeft: ".5rem",
                }}
              >
                {companyDetails.logo == "" ? (
                  <span
                    style={{
                      marginRight: "1rem",
                    }}
                  >
                    <HiUser size="90px" color="#000" />
                  </span>
                ) : (
                  <Image
                    loader={() => companyDetails.logo}
                    src={companyDetails.logo}
                    alt="logo"
                    height={90}
                    width={90}
                    style={{
                      marginRight: "1rem",
                    }}
                    className={utilityStyles.profilePhoto}
                  />
                )}
              </div>
              {companyDetails.logo !== "" ? (
                <span onClick={deleteLogo} className={utilityStyles.formButton}>
                  Delete logo
                </span>
              ) : (
                <label
                  for="logo"
                  style={{ width: "fit-content" }}
                  className={utilityStyles.formButton}
                >
                  Upload logo
                </label>
              )}
              <input
                type="file"
                name="logo"
                id="logo"
                className={utilityStyles.fileInput}
                onChange={handleLogoUpload}
              />
            </div>
          </div>

          <FieldContainer
            name="bio"
            required={true}
            label="Bio"
            smallText="Tell your company's story. What do you do?"
            fieldType={
              // <textarea
              //   maxLength={200}
              //   className={utilityStyles.roundOut}
              //   name="bio"
              //   id="bio"
              //   onChange={handleChangeInput}
              //   value={companyDetails.bio}
              // />
              <CustomTextArea
                maxLength={800}
                name="bio"
                handler={handleChangeInput}
                value={companyDetails.bio}
                height="260px"
              />
            }
          />

          <FieldContainer
            name="employeeCount"
            required={true}
            label="Number of employees"
            fieldType={
              <CustomSelect
                title={
                  companyDetails.employeeCount
                    ? companyDetails.employeeCount
                    : "Select"
                }
                name="employeeCount"
                onChangeHandler={handleChangeSelect}
                options={employeeCounts}
              />
            }
          />

          <FieldContainer
            name="location"
            required={true}
            label="Location"
            smallText="The location where your company resides. Helps employees to find employers in a suitable location. Ensure your formatting is correct (Include a comma & space between city & province)"
            fieldType={
              <input
                className={utilityStyles.input}
                type="text"
                name="location"
                id="location"
                onChange={handleChangeInput}
                placeholder="City, Province"
                value={companyDetails.location}
              />
            }
          />

          <FieldContainer
            name="email"
            required={true}
            label="Email"
            smallText="This email address will not be displayed publicly."
            fieldType={
              <input
                className={utilityStyles.input}
                type="email"
                name="email"
                id="email"
                onChange={handleChangeInput}
                defaultValue={
                  companyDetails.email
                    ? companyDetails.email
                    : !loading
                    ? user.email
                    : ""
                }
              />
            }
          />

          <FieldContainer
            name="industry"
            required={true}
            label="Industry"
            smallText="The industry that your company operates within"
            fieldType={
              <CustomSelect
                name="industry"
                title="🏭 Industry"
                value={companyDetails.industry}
                onChangeHandler={handleChangeSelect}
                options={industries}
              />
            }
          />
        </section>

        <section
          className={utilityStyles.formSection}
          style={{ paddingBottom: "1.5rem" }}
        >
          <h2>Values</h2>

          <FieldContainer
            name="culture"
            required={true}
            label="Culture"
            smallText="Describe the collection of attitudes, beliefs and behaviors that make up the regular atmosphere in a work environment. Mention stance on remote work, diversity, values, mission, etc."
            fieldType={
              // <textarea
              //   className={utilityStyles.roundOut}
              //   type="text"
              //   name="culture"
              //   id="culture"
              //   onChange={handleChangeInput}
              //   value={companyDetails.culture}
              // />
              <CustomTextArea
                maxLength={500}
                name="culture"
                handler={handleChangeInput}
                value={companyDetails.culture}
                height="240px"
              />
            }
          />

          <FieldContainer
            name="whyUs"
            required={true}
            label="Why work for us"
            smallText="Describe why a candidate should want to be a part of your company. What makes your great? What makes you stand-out?"
            fieldType={
              <CustomTextArea
                maxLength={500}
                name="whyUs"
                handler={handleChangeInput}
                value={companyDetails.whyUs}
                height="240px"
              />
            }
          />

          <FieldContainer
            name="interviewProcess"
            required={true}
            label="Interview process"
            smallText="The process a candidate will undergo from the moment they apply to being hired"
            fieldType={
              <CustomTextArea
                maxLength={500}
                name="interviewProcess"
                handler={handleChangeInput}
                value={companyDetails.interviewProcess}
                height="240px"
              />
            }
          />
        </section>
        <section className={utilityStyles.formSection}>
          <h2>Benefits</h2>
          <CustomSelect
            title="🍰Benefits"
            name="benefits"
            onChangeHandler={addBenefit}
            options={benefits}
          />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "1rem",
              width: "90%",
            }}
          >
            {companyDetails.benefits.map((benefit, index) => {
              return (
                <div
                  key={`benefit${index}`}
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
            })}
          </div>
        </section>
        <section className={utilityStyles.formSection}>
          <h2>Links</h2>
          <FieldContainer
            name="site"
            icon={<BsLink45Deg />}
            label={"Company website"}
            smallText="Your company's official website"
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
                  className={utilityStyles.mergeInputWithDiv}
                  type="text"
                  name="site"
                  id="site"
                  onChange={handleChangeInput}
                  value={companyDetails.site}
                />
              </div>
            }
          />
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
                  className={utilityStyles.mergeInputWithDiv}
                  type="text"
                  name="linkedIn"
                  id="linkedIn"
                  onChange={handleChangeInput}
                  value={companyDetails.linkedIn}
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
                  className={utilityStyles.mergeInputWithDiv}
                  type="text"
                  name="instagram"
                  id="instagram"
                  onChange={handleChangeInput}
                  value={companyDetails.instagram}
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
                  className={utilityStyles.mergeInputWithDiv}
                  type="text"
                  name="twitter"
                  id="twitter"
                  onChange={handleChangeInput}
                  value={companyDetails.twitter}
                />
              </div>
            }
          />
        </section>
        <section
          className={utilityStyles.formSection}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>Our team</h2>
          <small>
            The HR team/people that will interact with the candidates
          </small>

          <FieldContainer
            name="memberName"
            label="Name"
            fieldType={
              <input
                className={utilityStyles.input}
                type="text"
                name="memberName"
                id="memberName"
              />
            }
          />
          <FieldContainer
            name="memberEmail"
            label="Email address"
            smallText="The team member's company email address. This email will not be publicly displayed unless explicitly specified when posting a job"
            fieldType={
              <input
                className={utilityStyles.input}
                type="email"
                name="memberEmail"
                id="memberEmail"
              />
            }
          />
          <FieldContainer
            name="memberImg"
            label="Image"
            fieldType={
              <>
                <label htmlFor="memberImg" className={utilityStyles.formButton}>
                  Upload photo
                </label>
                <input
                  type="file"
                  name="memberImg"
                  className={utilityStyles.fileInput}
                  id="memberImg"
                />
              </>
            }
          />

          <button
            style={{ marginTop: "1rem" }}
            onClick={addTeamMember}
            className={utilityStyles.formButton}
          >
            Add
          </button>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {companyDetails.team.map((member, index) => {
              return (
                <div
                  key={`member${index}`}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: ".5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "120px",
                    }}
                  >
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt="profile photo"
                        loader={() => member.image}
                        height={90}
                        width={90}
                        className={utilityStyles.profilePhoto}
                      />
                    ) : (
                      <HiUserCircle size="90px" color="gray" />
                    )}
                    <span
                      className={utilityStyles.headerTextNSmall}
                      style={{ textAlign: "center" }}
                    >
                      {member.name}
                    </span>
                  </div>
                  <span
                    onClick={removeTeamMember}
                    id={`remMember-${index}`}
                    style={{ cursor: "pointer" }}
                  >
                    <MdCancel />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
        <button
          style={{ marginTop: "1rem" }}
          onClick={createProfile}
          className={utilityStyles.formButton}
        >
          {query.data ? "Edit Profile" : "Create profile"}
        </button>
      </div>
    </div>
  );
};

export default CompanyCreateProfile;
