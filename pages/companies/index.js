import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import candidateIndexStyles from "../../styles/indexCandidates.module.css";
import utilityStyles from "../../styles/utilities.module.css";
import Jobs from "../../sections/Jobs";
import CandidateCompanyPage from "../../sections/CandidateCompanyPage";
import CompanyCandidateList from "./candidate-list";

const CompanyLandingPage = () => {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const response = await getDoc(doc(db, "companies", result.user.uid));
        if (response.data()) {
          router.push("/companies/candidate-list");
        } else {
          try {
            const company = await getDoc(doc(db, "candidates", user.uid));
            if (company.data()) {
              window.alert("User already exists");
              await signOut(auth);
              return;
            } else {
              router.push("/companies/create-profile");
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
      router.push("/companies");
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
          <span className={candidateIndexStyles.featureEmoji}>🔍</span>
          <span>The right candidates for you</span>
        </div>
        <div className={candidateIndexStyles.feature}>
          <span className={candidateIndexStyles.featureEmoji}>🤝🏾</span>
          <span>Connect with candidates</span>
        </div>
        <div className={candidateIndexStyles.feature}>
          <span className={candidateIndexStyles.featureEmoji}>🕺🏾</span>
          <span>Only pay when you hire</span>
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
          <span style={{ marginRight: "2rem"}}>
            Preview of candidates
          </span>
        </div>
        <CompanyCandidateList isPreview={true}/>
      </div>
    </div>
  );
};

export default CompanyLandingPage;
