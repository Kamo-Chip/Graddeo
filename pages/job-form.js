import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import jobFormStyles from "../styles/jobForm.module.css";
import jobCardStyles from "../styles/jobCardStyles.module.css";
import jobStyles from "../styles/jobs.module.css";
import utilityStyles from "../styles/utilities.module.css";
import Image from "next/image";
import { MdCancel } from "react-icons/md";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { RiContactsBookLine } from "react-icons/ri";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v1 as uuidv1 } from "uuid";
import { formatLink, formatSalary } from "../lib/format";
import { useRouter } from "next/router";
import CustomSelect from "../components/CustomSelect";

const JobForm = () => {
  const [jobDetails, setJobDetails] = useState({
    companyName: "",
    position: "",
    jobType: "",
    benefits: [],
    location: "",
    salary: "",
    salaryIsNegotiable: false,
    description: "",
    applicationURL: "",
    applicationEmail: "",
    companyLogo: "/black.jpg",
    hasCustomBackground: false,
    background: "#fff",
    datePosted: null,
    jobId: "",
    companyEmail: "",
    invoiceEmail: "",
    site: "",
  });
  const [showBenefits, setShowBenefits] = useState(false);
  const [showJobTypes, setShowJobTypes] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    let value = e.target.innerText;
    let id = e.target.parentElement.parentElement.id;

    if (id === "benefits") {
      if (!jobDetails.benefits.includes(value)) {
        let newBenefits = [...jobDetails.benefits, value];
        setJobDetails({ ...jobDetails, [id]: newBenefits });
        setShowBenefits(false);
      }
    } else if (id === "jobType") {
      setJobDetails({ ...jobDetails, [id]: value });
      document.querySelector("#jobTypeTitle").innerText = value;
    } else {
      setJobDetails({ ...jobDetails, [id]: value });
    }
  };

  const handleChangeForInput = (e) => {
    setJobDetails({ ...jobDetails, [e.target.id]: e.target.value });
  };

  const removeBenefit = (e) => {
    let value = e.currentTarget.parentElement.children[0].innerText;
    let newBenefits = jobDetails.benefits.filter(
      (benefit) => benefit !== value
    );
    setJobDetails({ ...jobDetails, benefits: newBenefits });
  };

  const toggleColorPicker = (e) => {
    setJobDetails({ ...jobDetails, hasCustomBackground: e.target.checked });
  };

  const toggleNegotiableSalary = (e) => {
    setJobDetails({ ...jobDetails, salaryIsNegotiable: e.target.checked });
  };

  const changeBackground = (e) => {
    setJobDetails({ ...jobDetails, background: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let options = {
      msecs: new Date().getTime(),
    };

    setJobDetails((prevDetails) => ({
      ...prevDetails,
      datePosted: Timestamp.now(),
      jobId:
        formatLink(jobDetails.companyName + jobDetails.position) +
        uuidv1(options),
    }));

    setIsDone(true);
    //job successfully posted. view post
  };

  const addItemToCollection = async (item, collectionToAdd) => {
    await addDoc(collection(db, collectionToAdd), item);
  };

  const companyExists = async (companyName) => {
    const q = query(
      collection(db, "companies"),
      where("name", "==", companyName)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs[0]) {
      return true;
    }

    return false;
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = document.querySelector("#companyLogo").files[0];
    if (!file) return;
    const storageRef = ref(
      storage,
      `companyLogos/${jobDetails.companyName}/${file.name}`
    );
    uploadBytes(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            console.log(url);
            setJobDetails({ ...jobDetails, companyLogo: url });
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.log(err));
  };

  const handleImageChange = (e) => {
    // if(e.target.files[0]) {
    //   setJobDetails({...jobDetails, companyLogo: e.target.files[0]});
    // }
  };

  const getCompanyDetails = async () => {
    const q = query(
      collection(db, "companies"),
      where("name", "==", jobDetails.companyName)
    );
    const querySnapshot = await getDocs(q);

    let jobs = [];
    let id = "";
    querySnapshot.forEach((doc) => {
      jobs = doc.data().jobs;
      id = doc.id;
    });

    jobs.push(jobDetails.jobId);

    await setDoc(doc(db, "companies", id), { jobs: jobs }, { merge: true });
  };

  useEffect(() => {
    if (isDone) {
      addItemToCollection(jobDetails, "jobs");

      companyExists(jobDetails.companyName).then((companyDoesExist) => {
        if (!companyDoesExist) {
          addItemToCollection(
            {
              name: jobDetails.companyName,
              description: "",
              logo: jobDetails.companyLogo,
              email: jobDetails.companyEmail,
              invoiceEmail: jobDetails.invoiceEmail,
              jobs: [jobDetails.jobId],
              site: jobDetails.site,
            },
            "companies"
          );
        } else {
          getCompanyDetails();
        }
      });
      router.push("/");
    }
  }, [jobDetails.datePosted]);

  return (
    <div className={jobFormStyles.container}>
      <form className={jobFormStyles.form}>
        <section>
          <h2>Job</h2>
          <div className={jobFormStyles.fieldContainer}>
            <label>Company name*</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Position*</label>
            <input
              type="text"
              id="position"
              name="position"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Job type*</label>
            <CustomSelect
              name="jobType"
              title="💼Job type"
              onChangeHandler={handleChange}
              stateTracker={showJobTypes}
              setStateTracker={setShowJobTypes}
              options={["🕛Full-time", "🕧Part-time", "⌚Internship"]}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Benefits*</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CustomSelect
                name="benefits"
                onChangeHandler={handleChange}
                title="🪅Benefits"
                stateTracker={showBenefits}
                setStateTracker={setShowBenefits}
                options={[
                  "📜Degree not required",
                  "⚖️Work/life balance",
                  "🏋️Gym membership",
                  "📖Learning budget",
                  "🤼Pair programs",
                  "🌈Diverse team",
                ]}
              />
              <div
                style={{
                  marginTop: "1em",
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
                    })
                  : null}
              </div>
            </div>
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Location*</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, Province"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Salary</label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                type="number"
                id="salary"
                name="salary"
                onChange={handleChangeForInput}
                className={utilityStyles.roundOut}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: ".5em",
                }}
              >
                <label>Negotiable</label>
                <input
                  type="checkbox"
                  id="salary-negotitable"
                  onClick={toggleNegotiableSalary}
                  className={utilityStyles.roundOut}
                />
              </div>
            </div>
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Description*</label>
            <input
              type="text"
              id="description"
              name="description"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Application URL</label>
            <input
              type="text"
              id="applicationURL"
              name="applicationURL"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Application email</label>
            <input
              type="text"
              id="applicationEmail"
              name="applicationEmail"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Company Logo</label>
            <input
              type="file"
              id="companyLogo"
              name="companyLogo"
              onChange={handleImageChange}
              // className={utilityStyles.roundOut}
            />
            <button onClick={handleImageUpload}>Upload</button>
          </div>
        </section>
        <section>
          <h2>Customise Job Post</h2>
          <div className={jobFormStyles.customisationsContainer}>
            <div className={jobFormStyles.customisations}>
              <label>Highlight your post in yellow {"(+R200)"}</label>
              <input type="checkbox" onClick={toggleColorPicker} />
            </div>
            <div className={jobFormStyles.customisations}>
              <label>Highlight with your {"company's brand colour (+R400)"}</label>
              <input type="checkbox" onClick={toggleColorPicker} />
            </div>
            {/* <label>Use brand colours</label>
            <input type="checkbox" onClick={toggleColorPicker} /> */}
            {jobDetails.hasCustomBackground ? (
              <input
                type="color"
                id="background-color"
                onChange={changeBackground}
                className={utilityStyles.roundOut}
              />
            ) : null}
          </div>
          <JobCard
            companyName={jobDetails.companyName}
            companyLogo={jobDetails.companyLogo}
            position={jobDetails.position}
            location={jobDetails.location}
            salary={jobDetails.salary}
            benefits={jobDetails.benefits}
            jobType={jobDetails.jobType}
            companyEmail={jobDetails.companyEmail}
            invoiceEmail={jobDetails.invoicEmail}
            background={jobDetails.background}
            hasCustomBackground={jobDetails.hasCustomBackground}
            applicationEmail={jobDetails.applicationEmail}
            applitcationURL={jobDetails.applicationURL}
            description={jobDetails.description}
            salaryIsNegotiable={jobDetails.salaryIsNegotiable}
            jobId={jobDetails.jobId}
          />
        </section>
        <section>
          <h2>Company Details</h2>
          <div className={jobFormStyles.fieldContainer}>
            <label>Company email</label>
            <input
              type="text"
              name="companyEmail"
              id="companyEmail"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Invoice email</label>
            <input
              type="text"
              name="invoiceEmail"
              id="invoiceEmail"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
          <div className={jobFormStyles.fieldContainer}>
            <label>Website</label>
            <input
              type="text"
              name="site"
              id="site"
              onChange={handleChangeForInput}
              className={utilityStyles.roundOut}
            />
          </div>
        </section>
        <button onClick={handleSubmit}>Post</button>
      </form>
    </div>
  );
};

export default JobForm;
