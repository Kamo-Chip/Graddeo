import utilityStyles from "../styles/utilities.module.css";
import candidateListStyles from "../styles/candidateList.module.css";

const CustomCheckBox = ({ name, title, method }) => {
  return (
    <div
      className={`${utilityStyles.filterOption} ${candidateListStyles.filterOption}`}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: ".5em" }}>{title}</span>
      <input type="checkbox" name={name} id={name} onChange={method} style={{marginLeft: "auto", marginRight: ".5rem"}}/>
    </div>
  );
};

export default CustomCheckBox;