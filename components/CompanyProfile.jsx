import Router, { useRouter } from "next/router";
import profileStyles from "../styles/profile.module.css";
import utilityStyles from "../styles/utilities.module.css";
import jobCardStyles from "../styles/jobCardStyles.module.css";
import { HiUserCircle, HiUsers } from "react-icons/hi";
import { MdDelete, MdLogout } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { formatText } from "../lib/format";
import JobCard from "../components/JobCard";

const CompanyProfile = ({
  companyDetails,
  jobsList,
  signout,
  candidateIsViewing,
  deleteJob
}) => {
  return (
    <div className={profileStyles.container}>
      <div
        className={`${utilityStyles.form}`}
        style={{ alignItems: "unset", padding: "0 2em 2em 2em" }}
      >
        <div className={profileStyles.section}>
          <h2 className={utilityStyles.leftAlignedText}>
            About {companyDetails.name}
          </h2>
          <div className={profileStyles.personalContainer}>
            {!companyDetails.logo ? (
              <HiUserCircle size="90px" color="gray" />
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

            <div style={{ display: "flex", flexDirection: "column" }}>
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
              <span className={profileStyles.bio}>{companyDetails.bio}</span>
            </div>
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2
            className={utilityStyles.leftAlignedText}
            style={{ marginBottom: "1rem" }}
          >
            Jobs
          </h2>
          {jobsList.length
            ? jobsList.map((job, idx) => {
                return (
                  <div key={`jobList${idx}`}>
                    <Link
                      href={
                        candidateIsViewing
                          ? `/candidates/jobs/${job.jobId}`
                          : `/companies/jobs/${job.jobId}`
                      }
                      className={jobCardStyles.link}
                    >
                      <JobCard
                        companyName={job.companyName}
                        companyLogo={job.companyLogo}
                        position={job.position}
                        location={job.location}
                        salary={job.salary}
                        datePosted={job.datePosted}
                        benefits={job.benefits}
                        jobType={job.jobType}
                        companyEmail={job.companyEmail}
                        invoiceEmail={job.invoicEmail}
                        background={job.background}
                        hasCustomBackground={job.hasCustomBackground}
                        applicationEmail={job.applicationEmail}
                        applitcationURL={job.applicationURL}
                        description={job.description}
                        salaryIsNegotiable={job.salaryIsNegotiable}
                        jobId={job.jobId}
                        salaryType={job.salaryType}
                      />
                    </Link>
                    {!candidateIsViewing ? <span onClick={deleteJob} id={`rem-${job.jobId}`}><MdDelete/></span> : null}
                  </div>
                );
              })
            : "Company does not currently have active job posts"}
        </div>
        <div className={profileStyles.section}>
          <h2>Values</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <span className={utilityStyles.headerTextN}>Why work for us</span>
              <span>{companyDetails.whyUs}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <span className={utilityStyles.headerTextN}>Culture</span>
              <span>{companyDetails.culture}</span>
            </div>
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2>Benefits</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            {companyDetails.benefits
              ? companyDetails.benefits.map((benefit, index) => {
                  return (
                    <span
                      key={`benefit${index}`}
                      className={utilityStyles.roundOut}
                      style={{ margin: "0 .5rem .5rem 0" }}
                    >
                      <b>{benefit}</b>
                    </span>
                  );
                })
              : null}
          </div>
        </div>
        <div className={profileStyles.section}>
          <h2 style={{ marginBottom: "1rem" }}>Interview Process</h2>
          <span>{companyDetails.interviewProcess}</span>
        </div>

        {companyDetails.team && companyDetails.team.length ? (
          <div>
            <h2>Our HR team</h2>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexWrap: "wrap",
                paddingBottom: "1rem",
                width: "90%",
              }}
            >
              {companyDetails.team.map((member, index) => {
                return (
                  <div key={`member${index}`}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt="profile photo"
                          loader={() => member.image}
                          height={90}
                          width={90}
                          className={utilityStyles.profilePhoto}
                          style={{
                            margin: ".5rem",
                          }}
                        />
                      ) : (
                        <HiUserCircle size="90px" color="gray" />
                      )}
                      {member.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {!candidateIsViewing ? (
          <button
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
        ) : null}
      </div>
      {!candidateIsViewing ? (
        <button
          style={{
            marginBottom: "1rem",
          }}
          onClick={signout}
        >
          <MdLogout /> Logout
        </button>
      ) : null}
    </div>
  );
};

export default CompanyProfile;
