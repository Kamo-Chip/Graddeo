import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import layoutStyles from "../styles/layout.module.css";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation/>
      <main className={layoutStyles.main}>{children}</main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
