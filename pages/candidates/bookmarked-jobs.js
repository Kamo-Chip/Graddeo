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
      newBookmarkedJobs.push(data.data());
    }
    setBookmarkedJobs(newBookmarkedJobs);
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
      router.push("/companies");
    } else if (!loading && user) {
      getBookmarkedJobs();
    }
  }, [loading, user]);

  return (
    <div className={utilityStyles.containerFlex}>
      <div>
        {bookmarkedJobs.length
          ? bookmarkedJobs.map((element, idx) => {
              return (
                <div
                  key={`candidate${idx}`}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <div>
                    <JobCard
                      companyName={element.companyName}
                      position={element.position}
                      jobType={element.jobType}
                      benefits={element.benefits}
                      location={element.location}
                      salary={element.salary}
                      companyLogo={element.companyLogo}
                      background={element.background}
                      datePosted={element.datePosted}
                      salaryType={element.salaryType}
                    />
                  </div>
                  <span
                    id={`rem-${element.jobId}`}
                    onClick={removeBookmarkedJob}
                  >
                    <MdBookmarkRemove />
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