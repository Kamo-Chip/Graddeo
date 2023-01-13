import utilityStyles from "../../styles/utilities.module.css";
import profileStyles from "../../styles/profile.module.css";
import CustomSelect from "../../components/CustomSelect";
import { useEffect, useState } from "react";
import { HiUserCircle } from "react-icons/hi";
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
import { benefits } from "../../lib/filterOptions.json";
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

    if (!inputIsValid()) {
      window.alert("Fill in all required (*) fields");
    } else if (!linksAreValid()) {
      window.alert("Format links correctly as indicated");
    } else {
      setCompanyDetails((prevState) => ({
        ...prevState,
        companyId: formatTextRemoveSpaces(companyDetails.name)
          .concat("-")
          .concat(user.uid),
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
    if (query.data) {
      setCompanyDetails(JSON.parse(query.data));
    }
  }, []);

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

  return (
    <div className={utilityStyles.containerFlex}>
      <div
        className={utilityStyles.form}
        style={{ alignItems: "unset", padding: "0 2em 2em 2em" }}
      >
        <section
          className={profileStyles.section}
          style={{ paddingBottom: "1.5rem" }}
        >
          <h2>{"Let's get started"}</h2>

          <FieldContainer
            name="name"
            required={true}
            label="Company name"
            fieldType={
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="name"
                id="name"
                onChange={handleChangeInput}
                value={companyDetails.name}
              />
            }
          />

          <FieldContainer
            name="bio"
            required={true}
            label="Bio"
            smallText="Tell your company's story. What do you do?"
            fieldType={
              <textarea
                maxLength={200}
                className={utilityStyles.roundOut}
                name="bio"
                id="bio"
                onChange={handleChangeInput}
                value={companyDetails.bio}
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
                options={["11-50", "51-200", "201-1 000", "> 1 000"]}
              />
            }
          />

          <FieldContainer
            name="location"
            required={true}
            label="Location"
            fieldType={
              <input
                className={utilityStyles.roundOut}
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
            fieldType={
              <input
                className={utilityStyles.roundOut}
                type="text"
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
          <div className={utilityStyles.fieldContainer}>
            <div className={utilityStyles.labelContainer}>
              <label htmlFor="logo">Profile photo</label>
              <small>A photo of your pretty face {":)"}</small>
            </div>
            <div className={utilityStyles.fileInputContainer}>
              <input
                type="file"
                name="logo"
                id="logo"
                className={utilityStyles.fileInput}
                onChange={handleLogoUpload}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {!companyDetails.logo ? (
                <HiUserCircle size="90px" color="gray" />
              ) : (
                <Image
                  loader={() => companyDetails.logo}
                  src={companyDetails.logo}
                  alt="logo"
                  height={90}
                  width={90}
                  style={{
                    marginTop: "1rem",
                    marginRight: "1rem",
                    borderRadius: "50%",
                  }}
                />
              )}

              {companyDetails.logo ? (
                <span onClick={deleteLogo}>
                  <MdCancel />
                </span>
              ) : null}
            </div>
          </div>

          <FieldContainer
            name="industry"
            required={true}
            label="Industry"
            smallText="The industry that your company operates within. E.g) Finance, Gaming, etc."
            fieldType={
              <input
                className={utilityStyles.roundOut}
                type="text"
                name="industry"
                id="industry"
                onChange={handleChangeInput}
                value={companyDetails.industry}
              />
            }
          />
        </section>

        <section
          className={profileStyles.section}
          style={{ paddingBottom: "1.5rem" }}
        >
          <h2>Values</h2>

          <FieldContainer
            name="culture"
            required={true}
            label="Culture"
            smallText="Describe the collection of attitudes, beliefs and behaviors that make up the regular atmosphere in a work environment. Mention stance on remote work, diversity, values, mission, etc."
            fieldType={
              <textarea
                className={utilityStyles.roundOut}
                type="text"
                name="culture"
                id="culture"
                onChange={handleChangeInput}
                value={companyDetails.culture}
              />
            }
          />

          <FieldContainer
            name="whyUs"
            required={true}
            label="Why work for us"
            smallText="Describe why a candidate should want to be a part of your company. What makes your great? What makes you stand-out?"
            fieldType={
              <textarea
                className={utilityStyles.roundOut}
                type="text"
                name="whyUs"
                id="whyUs"
                onChange={handleChangeInput}
                value={companyDetails.whyUs}
              />
            }
          />

          <FieldContainer
            name="interviewProcess"
            required={true}
            label="Interview process"
            smallText="The process a candidate will undergo from the moment they apply to being hired"
            fieldType={
              <textarea
                className={utilityStyles.roundOut}
                name="interviewProcess"
                id="interviewProcess"
                onChange={handleChangeInput}
                value={companyDetails.interviewProcess}
              />
            }
          />
        </section>
        <section className={profileStyles.section}>
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
                className={utilityStyles.roundOut}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>http://</div>
                <input
                  className={utilityStyles.roundOut}
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
                className={utilityStyles.roundOut}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://www.linkedin.com/in/</div>
                <input
                  className={utilityStyles.roundOut}
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
                className={utilityStyles.roundOut}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://www.instagram.com/</div>
                <input
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
                className={utilityStyles.roundOut}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>https://twitter.com//</div>
                <input
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
          className={profileStyles.section}
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
                className={utilityStyles.roundOut}
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
                className={utilityStyles.roundOut}
                type="email"
                name="memberEmail"
                id="memberEmail"
              />
            }
          />
          <FieldContainer
            name="memberImg"
            label="Image"
            fieldType={<input type="file" name="memberImg" id="memberImg" />}
          />

          <button style={{ marginTop: "1rem" }} onClick={addTeamMember}>
            Add
          </button>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "1rem",
              width: "90%",
            }}
          >
            {companyDetails.team.map((member, index) => {
              return (
                <div
                  key={`member${index}`}
                  style={{ display: "flex", flexDirection: "row" }}
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
                        height={90}
                        width={90}
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <HiUserCircle size="90px" color="gray" />
                    )}
                    {member.name}
                  </div>
                  <span onClick={removeTeamMember} id={`remMember-${index}`}>
                    <MdCancel />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
        <button style={{ marginTop: "1rem" }} onClick={createProfile}>
          {query.data ? "Edit Profile" : "Create profile"}
        </button>
      </div>
    </div>
  );
};

export default CompanyCreateProfile;
