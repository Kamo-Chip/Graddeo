import Hero from "../sections/Hero";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const checkUserExists = async () => {
    try {
      const response = await getDoc(doc(db, "candidates", user.uid));

      if (response.data()) {
        router.push("/candidates/jobs");
      } else {
        router.push("/candidates/create-profile");
      }
    } catch (err) {
      console.error(err);
    }

    try {
      const response = await getDoc(doc(db, "companies", user.uid));

      if (response.data()) {
        router.push("/companies/candidate-list");
      } else {
        router.push("/companies/create-profile");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user) {
      // checkUserExists();
    }
  }, [user]);

  return (
    <>
      <Hero />
    </>
  );
}
