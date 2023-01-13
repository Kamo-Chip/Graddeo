import Jobs from "../../sections/Jobs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/router";
import { useState } from "react";

const CandidateJobsPage = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  
  useState(() => {
    if (!loading && !user) {
      router.push("/candidates");
    }
  }, [loading, user]);

  return (
    <div>
      <h1>Find your dream job✨</h1>
      <Jobs />
    </div>
  );
};

export default CandidateJobsPage;
