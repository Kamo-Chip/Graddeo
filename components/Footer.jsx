import Link from "next/link";
import React from "react";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <span
        className="local"
        style={{ padding: "0" }}
      >
        &copy; 2022 <Link href="/" style={{fontFamily: "grifter"}}>MakersDev</Link> &#127487;&#127462;
      </span>
      <span className="socials">
        <span>Stay connected with us</span>
        <Link href="https://www.instagram.com/makersdev/"  target="_blank" rel="noreferrer">
          <AiFillInstagram size="2rem" />
        </Link>
      </span>
    </footer>
  );
};

export default Footer;