import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import routeIndexStyles from "../../styles/routeIndex.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import Jobs from "../../sections/Jobs";
import CandidateCompanyPage from "../../sections/CandidateCompanyPage";
import Image from "next/image";

const CandidateLandingPage = () => {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [previewJobs, setPreviewJobs] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const response = await getDoc(doc(db, "candidates", result.user.uid));
        if (response.data()) {
          router.push("/candidates/jobs");
        } else {
          try {
            const company = await getDoc(doc(db, "companies", result.user.uid));
            if (company.data()) {
              window.alert(
                "This email is associated with a company account. Sign in on the company page"
              );
              await signOut(auth);
              return;
            } else {
              router.push("/candidates/create-profile");
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={routeIndexStyles.container}>
      <section className={routeIndexStyles.section1}>
        <h1>
          Launch your career
          <br />
          on Graddeo
        </h1>
        <button
          onClick={handleSubmit}
          style={{ backgroundColor: "var(--color-1)", padding: "1em 2.5em" }}
        >
          Sign up
        </button>
        <div className={routeIndexStyles.featuresContainer}>
          <div className={routeIndexStyles.feature}>
            <span className={routeIndexStyles.featureEmoji}>🤩</span>
            <span>The right jobs for you</span>
          </div>
          <div className={routeIndexStyles.feature}>
            <span className={routeIndexStyles.featureEmoji}>🔌</span>
            <span>Connect with employers</span>
          </div>
          <div className={routeIndexStyles.feature}>
            <span className={routeIndexStyles.featureEmoji}>💼</span>
            <span>No work experience required</span>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "3rem",
        }}
      >
        <section
          style={{
            background: "var(--color-5)",
            color: "#fff",
            border: "solid #000 2px",
          }}
          className={routeIndexStyles.sectionPad}
        >
          <h2>Job hunting just got much easier</h2>
          <p className={routeIndexStyles.explanation}>
            {
              'Graddeo is a job marketplace that emphasizes you - a junior looking to break into tech. A quick search through all the established job search sites, such as LinkedIn, will show you that you are missing one key requirement - experience. It is extremely demotivating when you can\'t find jobs that suit you, so ditch all those old platforms and find your dream job with us. Gone are the days of seeing "junior positions" that require 5 years of experience.'
            }
          </p>
        </section>

        <h2>How it works</h2>
        <div className={routeIndexStyles.explanation2}>
          <Image src="/profile-creation.jpg" alt="" width={403} height={494} />
          <p
            style={{
              background: "var(--color-3)",
              color: "#000",
            }}
          >
            <b>Create your profile</b> and gain access to great job
            opportunities
          </p>
        </div>
        <div className={routeIndexStyles.explanation2}>
          <p
            style={{
              background: "var(--color-6)",
              color: "#000",
            }}
          >
            <b>Search</b> curated job posts
          </p>
          <Image src="/jobsearch.png" alt="" width={409.5} height={490.75} />
        </div>
        <div className={routeIndexStyles.explanation2}>
          <Image src="/message-hr.jpg" alt="" width={402.5} height={499.1} />
          <p
            style={{
              background: "var(--color-7)",
              color: "#000",
            }}
          >
            <b>Meet with employers</b> to learn more about company culture and
            open roles
          </p>
        </div>
        <div className={routeIndexStyles.explanation2}>
          <p
            style={{
              background: "var(--color-1)",
              color: "#000",
            }}
          >
            Apply in as few as
            <br />
            two clicks. <b>Get hired</b>
          </p>
          <Image src="/apply.jpg" alt="" width={400.62} height={496.32} />
        </div>
        <h2>Why use Graddeo for your job search?</h2>
        <div className={routeIndexStyles.details}>
          <Image src="/candidateindex.png" alt="" width={729} height={272} />
          <div
            style={{
              background: "var(--color-3)",
              color: "#000",
              border: "solid #000 2px",
              paddingTop: "1em",
            }}
            className={routeIndexStyles.sectionPad}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "1rem",
              }}
            >
              <span className={utilityStyles.headerTextN}>
                Upfront role and salary information
              </span>
              <span style={{ fontSize: "1.2rem" }}>
                All job posts have a detailed description of the role, including
                everything from remote friendliness to benefits
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "1rem",
              }}
            >
              <span className={utilityStyles.headerTextN}>
                Discover job opportunities that tick all your boxes
              </span>
              <span style={{ fontSize: "1.2rem" }}>
                With our advanced filtering feature you can curate searches to
                find your perfect job
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "1rem",
              }}
            >
              <span className={utilityStyles.headerTextN}>
                {"Gain access to curated jobs that are junior oriented"}
              </span>
              <span style={{ fontSize: "1.2rem" }}>
                All roles are directed towards to juniors, so it{" "}
                {"won't take you too long to find a position you like"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "var(--color-1)",
            padding: "1em 2.5em",
            marginTop: "2rem",
          }}
        >
          Sign up
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          marginTop: "3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              marginRight: "2rem",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            onClick={() => setPreviewJobs(true)}
          >
            {previewJobs ? <u>Preview jobs</u> : "Preview jobs"}
          </span>
          <span
            style={{
              marginLeft: "2rem",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            onClick={() => setPreviewJobs(false)}
          >
            {!previewJobs ? <u>Preview companies</u> : "Preview companies"}
          </span>
        </div>
        {previewJobs ? (
          <Jobs isPreview={true} />
        ) : (
          <CandidateCompanyPage isPreview={true} />
        )}
      </div>
    </div>
  );
};

export default CandidateLandingPage;
