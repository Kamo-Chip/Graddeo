import utilitStyles from "../styles/utilities.module.css";
import aboutStyles from "../styles/about.module.css";

const About = () => {
  return (
    <div
      className={utilitStyles.containerFlex}
    >
      <h1>
        Connecting Early Talent To <br />
        The Right Opportunities
      </h1>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div
          className={aboutStyles.detail}
          style={{ background: "var(--color-1)", color: "#000" }}
        >
          <h2>Who are juniors</h2>
          <p>Students, graduates, people starting out their careers</p>
        </div>
        <div
          className={aboutStyles.detail}
          style={{ background: "var(--color-3)", color: "#000" }}
        >
          <h2>Problems juniors face</h2>
          <p>
            <b>Most great opportunities remain undiscovered</b>
            <br />
            Established job search sites {"don't"} cater for juniors
          </p>
          <p>
            <b>Job listings are outrageous</b>
            <br />
            Majority of job listings are handled by third party recruiting
            agencies, who are not the most tech-savvy people out there, so{" "}
            {'"junior"'} positions might require 5 years of experience
          </p>
        </div>
        <div
          className={aboutStyles.detail}
          style={{ background: "var(--color-5)", color: "#fff" }}
        >
          <h2>Problems companies face</h2>
          <p>
            <b>Great candidates are hard to find</b>
            <br />
            Juniors {"don't"} know where to look for your open positions
          </p>
          <p>
            <b>Seniors are expensive and have a low retention</b>
            <br />
            Demand for seniors is constantly increasing. Hiring juniors could by
            your competitive advantage
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
