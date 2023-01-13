import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const CompanyLandingPage = () => {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [user, loading ] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const response = await getDoc(doc(db, "companies", result.user.uid));
        if (response.data()) {
          router.push("/companies/candidate-list");
        } else {
          router.push("/companies/create-profile");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    }
  }, [loading, user]);

  return (
    <div>
      <button onClick={handleSubmit}>Sign up</button>
    </div>
  );
};

export default CompanyLandingPage;
