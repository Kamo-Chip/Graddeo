import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { formatLink } from "./format";

export async function getJobs() {
    let jobs = [];

    const colRef = collection(db, "jobs");
    getDocs(colRef).then((snapshot) => {
      snapshot.docs.forEach((doc, idx) => {
        jobs.push({ ...doc.data() });
        jobs[idx].jobId = formatLink(jobs[idx].companyName) + "-" + formatLink(jobs[idx].jobTitle) + "-" + doc.id;
      });
      console.log(jobs)
      
    });
    return jobs;
}