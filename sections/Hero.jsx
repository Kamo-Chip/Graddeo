import heroStyles from "../styles/hero.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

const Hero = () => {
  const router = useRouter();

  return (
    <div className={heroStyles.container}>
      <div className={heroStyles.container2}>
        <div className={heroStyles.textContainer}>
          <h1 className={heroStyles.heroText}>
            Tech jobs <br />
            for juniors.
          </h1>
          <br />
          <span className={heroStyles.tagLine}>
            Job marketplace for juniors looking for a job in tech.
          </span>
          <div className={heroStyles.buttonContainer}>
            <button
              style={{
                marginRight: "3rem",
                backgroundColor: "var(--color-1)",
                letterSpacing: "1px",
              }}
              onClick={() => router.push("/candidates")}
            >
              Find a job
            </button>
            <button
              style={{
                backgroundColor: "var(--color-5)",
                color: "#fff",
                letterSpacing: "1px",
              }}
              onClick={() => router.push("/companies")}
            >
              Hire juniors
            </button>
          </div>
        </div>
        <div className={heroStyles.heroImage}>🧑🏾‍💻</div>
      </div>
    </div>
  );
};

export default Hero;
