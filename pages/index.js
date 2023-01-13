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
    if (user) {
      checkUserExists();
    }
  }, [user]);

  return (
    <>
      <Hero />
    </>
  );
}
