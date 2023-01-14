import Hero from "../sections/Hero";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export default function Home() {
  const [user] = useAuthState(auth);
  const [ companyInfo, setCompanyInfo] = useState({});
  const router = useRouter();

  const checkUserExists = async () => {
    // if(isSignInWithEmailLink(auth, window.location.href)) {
    //   let email = window.localStorage.getItem("emailForSignIn");
    //   console.log(email);

    //   if(!email) {
    //     email = window.prompt("Please provide your email for confirmation");
    //   }

    //   signInWithEmailLink(auth, email, window.location.href)
    //   .then((res) => {
    //     setCompanyInfo(res);
    //     // window.localStorage.removeItem("emailForSignIn");
    //     // if(res.additionalUserInfo.isNewUser){
    //     //   router.push("/companies/create-profile")
    //     // }
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
    // }
    try {
      const candidate = await getDoc(doc(db, "candidates", user.uid));
      if (candidate.data()) {
        router.push("/candidates/jobs");
      } else {
        try {
          const company = await getDoc(doc(db, "companies", user.uid));
          if (company.data()) {
            router.push("/companies/candidate-list");
          }
          return;
        } catch (err) {
          console.error(err);
        }
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if(user) {
      checkUserExists();
    }
  }, [user]);

  // useEffect(() => {
  //   console.log(companyInfo);
  //   console.log(companyInfo.additionalUserInfo);
  // }, [companyInfo])

  return (
    <>
      <Hero />
    </>
  );
}
