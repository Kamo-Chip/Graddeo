import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, sendSignInLinkToEmail } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const CompanyLandingPage = () => {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [ email, setEmail] = useState();
  const actionCodeSettings = {
    url: "http://localhost:3000",
    handleCodeInApp: true,
  }

  const handleChange = (e) => {
    setEmail(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // sendSignInLinkToEmail(auth, email, actionCodeSettings)
    // .then(() => {
    //   console.log("successfully signed in");
    //   window.localStorage.setItem("emailForSignIn", email);
    // }).catch((err) => {
    //   console.error(err.message);
    // })
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const response = await getDoc(doc(db, "companies", result.user.uid));
        if (response.data()) {
          router.push("/companies/candidate-list");
        } else {
          try {
            const candidate = await getDoc(doc(db, "candidates", user.uid));
            if (candidate.data()) {
              window.alert("User already exists");
              return;
            }else {
              router.push("/companies/create-profile");
              signOut(auth);
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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    }
  }, [loading, user]);

  return (
    <div>
      {/* <input type="email" name="email" id="email" onChange={handleChange}/> */}
      <button onClick={handleSubmit}>Sign up</button>
    </div>
  );
};

export default CompanyLandingPage;
