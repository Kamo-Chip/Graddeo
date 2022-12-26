import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push("/candidates/create-profile");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {}, []);

  return (
    <div>
      <form>
        <input
          type="email"
          id="email"
          placeholder="Enter your email address"
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Sign up</button>
      </form>
    </div>
  );
};

export default Login;
