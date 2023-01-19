import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";

const ProspectiveCandidates = () => {
  const [user, loading] = useAuthState(auth);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const groupBy = (objectArray, property) => {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, []);
  };

  const getJobs = async () => {
    const ref = await getDoc(doc(db, "companies", user.uid));
    let prospectiveCandidates = ref.data().prospectiveCandidates;
    console.log(prospectiveCandidates);
    const groupByJobName = groupBy(prospectiveCandidates, "jobName");
    console.log(groupByJobName[0]);
    setCandidates(groupByJobName);
  };

  useEffect(() => {
    if (user) {
      getJobs();
    }
  }, [user]);

  return (
    <div>
      <div>
      ProspectiveCandidates
      </div>
    </div>
  );
};
export default ProspectiveCandidates;
