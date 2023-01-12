import { db, auth } from "../../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import CandidateCard from "../../components/CandidateCard";
import utilityStyles from "../../styles/utilities.module.css";
import { MdBookmarkRemove } from "react-icons/md";

const BookmarkedCandidates = () => {
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const getBookmarkedCandidates = async () => {
    const res = await getDoc(doc(db, "companies", user.uid));
    let listOfIds = res.data().bookmarkedCandidates;
    let newBookmarkedCandidates = [];

    for (let i = 0; i < listOfIds.length; i++) {
      let data = await getDoc(doc(db, "candidates", listOfIds[i]));
      newBookmarkedCandidates.push(data.data());
    }
    setBookmarkedCandidates(newBookmarkedCandidates);
  };

  const removeBookmarkedCandidate = async (e) => {
    const candidateToRemove = e.currentTarget.id.split("-")[1];
    let newBookmarkedCandidates = [];

    for (let i = 0; i < bookmarkedCandidates.length; i++) {
      if (bookmarkedCandidates[i].candidateId != candidateToRemove) {
        newBookmarkedCandidates.push(bookmarkedCandidates[i].candidateId);
      }
    }
    setBookmarkedCandidates(newBookmarkedCandidates);

    await updateDoc(doc(db, "companies", user.uid), {
      bookmarkedCandidates: newBookmarkedCandidates,
    });
    // await deleteDoc(doc(db, "candidates", candidateToRemove));

    // let newcandidates = companyDetails.candidates.filter(candidate => candidate != candidateToRemove);
    // await updateDoc(doc(db, "companies", companyDetails.companyId.split("-")[1]), {
    //   candidates: newcandidates,
    // });

    // let newcandidatesList = bookmarkedCandidates.filter(candidate => candidate.candidateId != candidateToRemove);
    // setcandidatesList(newcandidatesList);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/companies");
    } else if (!loading && user) {
      getBookmarkedCandidates();
    }
  }, [loading, user]);

  return (
    <div className={utilityStyles.containerFlex}>
      <div>
        {bookmarkedCandidates.length
          ? bookmarkedCandidates.map((element, idx) => {
              return (
                <div
                  key={`candidate${idx}`}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <div>
                    <CandidateCard
                      degree={element.degree}
                      institution={element.institution}
                      location={element.location}
                      name={element.name}
                      profilePhoto={element.profilePhoto}
                      schoolYear={element.schoolYear}
                      skills={element.skills}
                    />
                  </div>
                  <span
                    id={`rem-${element.candidateId}`}
                    onClick={removeBookmarkedCandidate}
                  >
                    <MdBookmarkRemove />
                  </span>
                </div>
              );
            })
          : "No saved candidates"}
      </div>
    </div>
  );
};

export default BookmarkedCandidates;
