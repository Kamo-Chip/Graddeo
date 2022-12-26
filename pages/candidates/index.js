import { useRouter } from "next/router";

const CandidateLandingPage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Content goes here</h1>
      <button
        onClick={() => {
          router.push("/login");
        //   router.push("/candidates/create-profile");
        }}
      >
        Create profile
      </button>
    </div>
  );
};

export default CandidateLandingPage;
