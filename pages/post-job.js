import postJobStyles from "../styles/postJob.module.css";
import utilityStyles from "../styles/utilities.module.css";
import Link from "next/link";

const PostJob = () => {
    return (
        <div className={postJobStyles.container}>
            <Link className={utilityStyles.roundOut}href="job-form">Post Job</Link>
        </div>
    )
}

export default PostJob;