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
import Image from "next/image";
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
        Invest in your future.
        <br />
        Hire juniors.
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
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: "2rem",
        }}
      >
        <section
          style={{
            background: "var(--color-3)",
            color: "#000",
            padding: "1em 2em",
            border: "solid #000 2px",
          }}
        >
          <h2>Build for the future</h2>
          <p className={candidateIndexStyles.explanation}>
            {
              "Graddeo is a job marketplace that gives you access to eager and talented juniors. Hiring juniors means building for the future, and increases employee retention because they grow with you and become seniors down the line. While juniors need more time for training, their relative inexperience holds the opportunity for you to shape the team you want, thereby setting yourself up for long-term success."
            }
          </p>
        </section>

        <h2>How it works</h2>
        <div className={candidateIndexStyles.explanation2}>
          <Image
            src="/company-creation.jpg"
            alt=""
            width={405.04}
            height={469.09}
          />
          <p
            style={{
              background: "var(--color-1)",
              color: "#000",
              padding: "1em",
              border: "solid #000 2px",
            }}
          >
            <b>Create your profile</b> and gain access to the best
            <br />
            in early talent
          </p>
        </div>
        <div className={candidateIndexStyles.explanation2}>
          <p
            style={{
              background: "var(--color-6)",
              color: "#000",
              padding: "1em",
              border: "solid #000 2px",
            }}
          >
            <b>Post open roles</b>, for free, to a curated set of candidates.
          </p>
          <Image src="/jobpost.jpg" alt="" width={406.69} height={510.54} />
        </div>
        <div className={candidateIndexStyles.explanation2}>
          <Image
            src="/message-candidate.jpg"
            alt=""
            width={401.7}
            height={497.9}
          />
          <p
            style={{
              background: "var(--color-5)",
              color: "#fff",
              padding: "1em",
              border: "solid #000 2px",
            }}
          >
            <b>Meet with your top applicants</b> for interviews.
          </p>
        </div>
        <div className={candidateIndexStyles.explanation2}>
          <p
            style={{
              background: "var(--color-7)",
              color: "#000",
              padding: "1em",
              border: "solid #000 2px",
            }}
          >
            Further curate applicants with your own custom filters.
            <b> Make the hire</b>
          </p>
          <Image src="/filter.jpg" alt="" width={408.87} height={481.32} />
        </div>
        <h2>Why use Graddeo for your early talent recruiting?</h2>
        <div className={candidateIndexStyles.details}>
          <Image
            src="/companyindex.png"
            alt=""
            width={708.75}
            height={207.75}
          />
          <div
            style={{
              background: "var(--color-1)",
              color: "#000",
              padding: "1em",
              border: "solid #000 2px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "1rem",
              }}
            >
              <span className={utilityStyles.headerTextN}>
                Upfront candidate information
              </span>
              <span style={{ fontSize: "1.2rem" }}>
                Streamline your process of viewing candidates. Know everything
                about a candidate, from skills to visa status
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
                Discover candidates that suit your needs
              </span>
              <span style={{ fontSize: "1.2rem" }}>
                With our advanced filtering feature you can curate searches to
                find your perfect candidate
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
                {"You are losing money if you don't use us"}
              </span>
              <span style={{ fontSize: "1.2rem" }}>
                Sign up for free and only pay a 10% success fee when you hire.
                We are cheaper than traditional recruiting services and provide
                a lot more value
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <span style={{ fontSize: "1.2rem", marginTop: "3rem" }}>
            Preview of candidates
          </span>
        </div>
        <CompanyCandidateList isPreview={true} />
      </div>
    </div>
  );
};

export default CompanyLandingPage;
