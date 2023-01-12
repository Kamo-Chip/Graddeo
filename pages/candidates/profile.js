import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import CandidateProfile from "../../components/CandidateProfile";

const CandidateProfilePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();

  const getUserDetails = async () => {
    const result = await getDoc(doc(db, "candidates", user.uid));
    const data = result.data();
    setUserDetails(data);
  };

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/candidates/");
    }

    if (user) {
      getUserDetails();
      console.log(userDetails);
    }
  }, [user, loading]);

  return (
    <CandidateProfile
      candidate={userDetails}
      candidateIsViewing={true}
      signout={signout}
    />
  );
};

export default CandidateProfilePage;
