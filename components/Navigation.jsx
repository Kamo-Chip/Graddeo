import Link from "next/link";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { AiFillTwitterCircle } from "react-icons/ai";
// import LogoIcon from "../public/logo.png";
import { useEffect, useState } from "react";
import Image from "next/image";
// import { IoIosArrowBack } from "react-icons/io";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

const Navigation = () => {
  const [showNavItems, setShowNavItems] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const toggleNav = () => {
    const nav = document.querySelector(".nav-list");

    if (showNavItems) {
      nav.classList.remove("nav-on");
      nav.classList.add("nav-off");
      document.querySelector(".nav-socials").classList.add("disappear");
      document.querySelector(".nav-icon-container").style.position = "absolute";
      setShowNavItems(false);
    } else {
      nav.classList.remove("nav-off");
      nav.classList.add("nav-on");
      document.querySelector(".nav-socials").classList.remove("disappear");
      document.querySelector(".nav-socials").classList.add("nav-socials-on");
      document.querySelector(".nav-icon-container").style.position = "fixed";
      setShowNavItems(true);
    }
  };

  const closeNav = () => {
    if (showNavItems) {
      setShowNavItems(false);
      toggleNav();
    }
  };

  useEffect(() => {}, [showNavItems]);

  // useEffect(() => {
  //   Aos.init({ duration: 3000 });
  // }, []);

  return (
    <nav className="navigation">
      <header className="logo">
        <Link
          href={
            router.pathname.split("/")[1] == "candidates" &&
            router.pathname.split("/").length > 2
              ? "/candidates/jobs"
              : router.pathname.split("/")[1] == "companies" &&
                router.pathname.split("/").length > 2
              ? "/companies/candidate-list"
              : "/"
          }
        >
          Graddeo
        </Link>
      </header>
      <div className="nav-items-container">
        <div onClick={toggleNav} className="nav-icon-container">
          {showNavItems ? <HiX size="2rem" /> : <HiMenuAlt4 size="2rem" />}
        </div>

        <ul className="nav-list">
          {router.pathname.includes(
            "create-profile"
          ) ? null : router.pathname.split("/")[1] == "candidates" &&
            router.pathname.split("/").length > 2 ? (
            <>
              <li>
                <Link href="/candidates/jobs" onClick={closeNav}>
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/candidates/company-list" onClick={closeNav}>
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/candidates/profile" onClick={closeNav}>
                  Profile
                </Link>
              </li>
            </>
          ) : router.pathname.split("/")[1] == "companies" &&
            router.pathname.split("/").length > 2 ? (
            <>
              <li>
                <Link href="/companies/candidate-list" onClick={closeNav}>
                  Candidates
                </Link>
              </li>
              <li>
                <Link href="/companies/post-job" onClick={closeNav}>
                  Post Job
                </Link>
              </li>
              <li>
                <Link href="/companies/profile" onClick={closeNav}>
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/candidates/" onClick={closeNav}>
                  Students
                </Link>
              </li>
              <li>
                <Link href="/companies/" onClick={closeNav}>
                  Employers
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={closeNav}>
                  About
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-socials">
          <span>
            Follow us on twitter to be the first to know about jobs & other
            updates ⚡
          </span>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#fff" }}
            onClick={closeNav}
          >
            <AiFillTwitterCircle size="1.7rem" color="#000" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
