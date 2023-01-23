import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import candidateIndexStyles from "../../styles/indexCandidates.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import Jobs from "../../sections/Jobs";
import CompanyList from "./company-list";
import CandidateCompanyPage from "../../sections/CandidateCompanyPage";

const CandidateLandingPage = () => {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
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
            const company = await getDoc(doc(db, "companies", user.uid));
            if (company.data()) {
              window.alert("User already exists");
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

  useState(() => {
    if (!loading && !user) {
      router.push("/candidates");
    }
  }, [loading, user]);

  return (
    <div className={candidateIndexStyles.container}>
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
      <div className={candidateIndexStyles.featuresContainer}>
        <div className={candidateIndexStyles.feature}>
          <span className={candidateIndexStyles.featureEmoji}>🤩</span>
          <span>The right jobs for you</span>
        </div>
        <div className={candidateIndexStyles.feature}>
          <span className={candidateIndexStyles.featureEmoji}>🔌</span>
          <span>Connect with employers</span>
        </div>
        <div className={candidateIndexStyles.feature}>
          <span className={candidateIndexStyles.featureEmoji}>💼</span>
          <span>No work experience required</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          marginTop: "2rem",
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
            style={{ marginRight: "2rem", cursor: "pointer" }}
            onClick={() => setPreviewJobs(true)}
          >
            {previewJobs ? <u>Preview jobs</u> : "Preview jobs"}
          </span>
          <span
            style={{ marginLeft: "2rem", cursor: "pointer" }}
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
