import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const CandidateLandingPage = () => {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [user, loading ] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const response = await getDoc(doc(db, "candidates", result.user.uid));
        if (response.data()) {
          router.push("/candidates/jobs");
        } else {
          router.push("/candidates/create-profile");
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
    <div>
      <button onClick={handleSubmit}>Sign up</button>
    </div>
  );
};

export default CandidateLandingPage;
