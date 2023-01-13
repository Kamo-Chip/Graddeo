import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import CandidateProfile from "../../../components/CandidateProfile";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

export const getStaticProps = async (context) => {
  const q = query(
    collection(db, "candidates"),
    where("candidateId", "==", context.params.id)
  );
  const querySnapshot = await getDocs(q);

  let candidate = null;
  querySnapshot.forEach((doc) => {
    candidate = doc.data();
  });

  return {
    props: { candidate: candidate },
  };
};

export const getStaticPaths = async () => {
  let candidates = [];
  const snapshot = await getDocs(collection(db, "candidates"));
  snapshot.forEach((doc) => {
    candidates.push({ ...doc.data() });
  });

  const paths = candidates.map((candidate) => {
    return {
      params: { id: candidate.candidateId },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

const CandidateDetails = ({ candidate }) => {
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const getBookmarkedCandidates = async () => {
    const res = await getDoc(doc(db, "companies", user.uid));
    setBookmarkedCandidates(res.data().bookmarkedCandidates);
  };

  const addToBookmarkedCandidates = async (e) => {
    let newBookmarkedCandidates = [];
    if (!bookmarkedCandidates.includes(candidate.candidateId)) {
      e.currentTarget.children[0].style.color = "red";
      newBookmarkedCandidates.push(candidate.candidateId);
      setBookmarkedCandidates([...bookmarkedCandidates, candidate.candidateId]);
    } else {
      e.currentTarget.children[0].style.color = "#000";
      for (let i = 0; i < bookmarkedCandidates.length; i++) {
        if (bookmarkedCandidates[i] != candidate.candidateId) {
          newBookmarkedCandidates.push(bookmarkedCandidates[i]);
        }
      }
      setBookmarkedCandidates(newBookmarkedCandidates);
    }
    await updateDoc(doc(db, "companies", user.uid), {
      bookmarkedCandidates: newBookmarkedCandidates,
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    }

    if (!loading && user) {
      getBookmarkedCandidates();
    }
  }, [loading, user]);

  return (
    <CandidateProfile
      candidate={candidate}
      candidateIsViewing={false}
      addToBookmarkedCandidates={addToBookmarkedCandidates}
    />
  );
};

export default CandidateDetails;
