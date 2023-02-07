import Router, { useRouter } from "next/router";
import profileStyles from "../styles/profile.module.css";
import utilityStyles from "../styles/utilities.module.css";
import cardStyles from "../styles/card.module.css";
import { HiUser, HiUsers } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import {
  BsInstagram,
  BsLinkedin,
  BsLink45Deg,
  BsTwitter,
} from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { formatText, convertToDate } from "../lib/format";
import JobCard from "../components/JobCard";

const CompanyProfile = ({
  companyDetails,
  jobsList,
  signout,
  candidateIsViewing,
  deleteJob,
}) => {
  const today = new Date().toDateString();

  return (
    <div className={profileStyles.container}>
      <div className={`${utilityStyles.form}`} style={{ alignItems: "unset" }}>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "2rem" }}
        >
          <h2 className={utilityStyles.leftAlignedText}>
            {candidateIsViewing
              ? `About ${companyDetails.name}`
              : "Your Profile"}
          </h2>
          <div
            className={profileStyles.personalContainer}
            style={{ marginBottom: "2rem" }}
          >
            {!companyDetails.logo ? (
              <HiUser size="90px" color="#000" />
            ) : (
              <Image
                loader={() => companyDetails.logo}
                src={companyDetails.logo}
                width={110}
                height={110}
                alt="profile photo"
                className={utilityStyles.profilePhoto}
                style={{ marginRight: "2rem" }}
              />
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <a
                href={companyDetails.site}
                className={utilityStyles.grayedOutText}
                style={{ marginTop: ".5rem" }}
              >
                🔗{companyDetails.site ? formatText(companyDetails.site) : null}
              </a>
              <span
                className={utilityStyles.grayedOutText}
                style={{ marginTop: ".5rem" }}
              >
                🏭{companyDetails.industry}
              </span>
              <span
                className={utilityStyles.grayedOutText}
                style={{ marginTop: ".5rem" }}
              >
                📍{companyDetails.location}
              </span>
              <span
                className={utilityStyles.grayedOutText}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <HiUsers color="#000" />
                <span style={{ marginLeft: ".4rem" }}>
                  {companyDetails.employeeCount}
                </span>
              </span>
            </div>
          </div>
          <span
            className={profileStyles.bio}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {companyDetails.bio}
          </span>
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2
            className={utilityStyles.leftAlignedText}
            style={{ marginBottom: "1rem" }}
          >
            Jobs
          </h2>
          {jobsList.length
            ? jobsList.map((job, idx) => {
                return (
                  <div
                    key={`jobList${idx}`}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      {!candidateIsViewing ? (
                        <span>
                          {today == convertToDate(job.deadline).toDateString()
                            ? "Deadline has passed"
                            : null}
                        </span>
                      ) : null}
                      <Link
                        href={
                          candidateIsViewing
                            ? `/candidates/jobs/${job.jobId}`
                            : `/companies/jobs/${job.jobId}`
                        }
                        className={cardStyles.link}
                        style={{ maxWidth: "unset", width: "105%" }}
                      >
                        <JobCard job={job} companyProfileIsOpen={true} />
                      </Link>
                    </div>

                    {!candidateIsViewing ? (
                      <span
                        onClick={deleteJob}
                        id={`rem-${job.jobId}`}
                        style={{ marginRight: "-1em", cursor: "pointer" }}
                      >
                        <MdDelete size="2rem" />
                      </span>
                    ) : null}
                  </div>
                );
              })
            : "No open positions"}
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>Values</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <span
                className={utilityStyles.headerTextNSmall}
                style={{ marginBottom: ".5rem" }}
              >
                Why work for us
              </span>
              <span style={{ whiteSpace: "pre-wrap" }}>
                {companyDetails.whyUs}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <span
                className={utilityStyles.headerTextNSmall}
                style={{ marginBottom: ".5rem" }}
              >
                Culture
              </span>
              <span style={{ whiteSpace: "pre-wrap" }}>
                {companyDetails.culture}
              </span>
            </div>
          </div>
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>Benefits</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            {console.log(companyDetails)}
            {companyDetails.benefits
              ? companyDetails.benefits.map((benefit, index) => {
                  return (
                    <span
                      key={`benefit${index}`}
                      className={utilityStyles.itemBar}
                      style={{
                        margin: "0 .5rem .5rem 0",
                        backgroundColor: "#fff",
                      }}
                    >
                      <b>{benefit}</b>
                    </span>
                  );
                })
              : null}
          </div>
        </div>
        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Interview Process</h2>
          <span style={{ whiteSpace: "pre-wrap" }}>
            {companyDetails.interviewProcess}
          </span>
        </div>

        <div
          className={profileStyles.section}
          style={{ paddingBottom: "1rem" }}
        >
          <h2>🔗Links</h2>
          {companyDetails.linkedIn ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
                  <BsLinkedin /> LinkedIn
                </span>
              </div>
              <Link
                href={`https://www.linkedin.com/in/${companyDetails.linkedIn}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {companyDetails.linkedIn}
              </Link>
            </div>
          ) : null}
          {companyDetails.twitter ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
                  <BsTwitter /> Twitter
                </span>
              </div>
              <Link
                href={`https://twitter.com/${companyDetails.twitter}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {companyDetails.twitter}
              </Link>
            </div>
          ) : null}
          {companyDetails.instagram ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
                  <BsInstagram /> Instagram
                </span>
              </div>
              <Link
                href={`https://www.instagram.com/${companyDetails.instagram}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {companyDetails.instagram}
              </Link>
            </div>
          ) : null}
          {companyDetails.site ? (
            <div className={utilityStyles.fieldContainer}>
              <div className={utilityStyles.labelContainer}>
                <span className={utilityStyles.headerTextNSmall}>
                  <BsLink45Deg /> Website
                </span>
              </div>
              <Link
                href={`http://${companyDetails.site}`}
                target="_blank"
                style={{ color: "var(--link-color)" }}
              >
                {formatText(companyDetails.site)}
              </Link>
            </div>
          ) : null}
        </div>

        {companyDetails.team && companyDetails.team.length ? (
          <div className={profileStyles.section}>
            <h2>Our HR team</h2>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {companyDetails.team.map((member, index) => {
                return (
                  <div
                    key={`member${index}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      margin: ".5rem",
                    }}
                  >
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt="profile photo"
                        loader={() => member.image}
                        height={80}
                        width={80}
                        className={utilityStyles.profilePhoto}
                      />
                    ) : (
                      <HiUser size="80px" color="#000" />
                    )}
                    <span className={utilityStyles.headerTextNSmall}>
                      {member.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {!candidateIsViewing ? (
          <>
            <button
              className={utilityStyles.formButton}
              style={{ alignSelf: "center", marginTop: "2rem" }}
              onClick={() =>
                Router.push(
                  {
                    pathname: "/companies/create-profile",
                    query: { data: JSON.stringify(companyDetails) },
                  },
                  "/companies/edit-profile"
                )
              }
            >
              Edit profile
            </button>
            <button
              style={{
                alignSelf: "center",
                marginTop: "1rem",
                backgroundColor: "var(--red)",
                color: "#fff",
              }}
              onClick={signout}
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CompanyProfile;
