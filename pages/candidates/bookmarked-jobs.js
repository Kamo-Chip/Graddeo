import { db, auth } from "../../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import JobCard from "../../components/JobCard";
import utilityStyles from "../../styles/utilities.module.css";
import { MdBookmarkRemove } from "react-icons/md";

const BookmarkedJobs = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const getBookmarkedJobs = async () => {
    const res = await getDoc(doc(db, "candidates", user.uid));
    let listOfIds = res.data().bookmarkedJobs;
    let newBookmarkedJobs = [];

    for (let i = 0; i < listOfIds.length; i++) {
      let data = await getDoc(doc(db, "jobs", listOfIds[i]));
      if (data.data()) {
        newBookmarkedJobs.push(data.data());
      }
    }
    setBookmarkedJobs(newBookmarkedJobs);
    await updateDoc(doc(db, "candidates", user.uid), {
      bookmarkedJobs: newBookmarkedJobs,
    });
  };

  const removeBookmarkedJob = async (e) => {
    const jobToRemove = e.currentTarget.id.split("-")[1];
    let newBookmarkedJobs = [];

    for (let i = 0; i < bookmarkedJobs.length; i++) {
      if (bookmarkedJobs[i].jobId != jobToRemove) {
        newBookmarkedJobs.push(bookmarkedJobs[i].jobId);
      }
    }
    setBookmarkedJobs(newBookmarkedJobs);
    console.log(newBookmarkedJobs);
    await updateDoc(doc(db, "candidates", user.uid), {
      bookmarkedJobs: newBookmarkedJobs,
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/candidates");
    } else if (!loading && user) {
      getBookmarkedJobs();
    }
  }, [loading, user]);

  return (
    <div className={utilityStyles.containerFlex}>
      <div style={{ width: "100%" }}>
        {bookmarkedJobs.length
          ? bookmarkedJobs.map((element, idx) => {
              return (
                <div
                  key={`candidate${idx}`}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                  }}
                >
                  <JobCard job={element} />
                  <span
                    id={`rem-${element.jobId}`}
                    onClick={removeBookmarkedJob}
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "0",
                      margin: ".5rem .5rem 0 0",
                      cursor: "pointer",
                    }}
                  >
                    <MdBookmarkRemove size="2rem" />
                  </span>
                </div>
              );
            })
          : "No saved Jobs"}
      </div>
    </div>
  );
};

export default BookmarkedJobs;
