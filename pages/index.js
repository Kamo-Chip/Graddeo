import Hero from "../sections/Hero";
import Jobs from "../sections/Jobs";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if(user) {
      router.push("/candidates/jobs");
    }
  }, [user]);
  
  return (
    <>
        <Hero/>
        <Jobs/>
    </>
  )
}
