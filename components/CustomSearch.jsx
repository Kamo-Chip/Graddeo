import { MdAdd } from "react-icons/md";
import utilityStyles from "../styles/utilities.module.css";
import candidateListStyles from "../styles/candidateList.module.css";

const CustomSearch = ({name, title, method, emoji, }) => {
  return (
    <div
      className={`${utilityStyles.roundOut} ${candidateListStyles.filterOption}`}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {emoji}
      <input type="text" name={name} id={name} style={{ border: "none", fontSize: "1rem", width: "120px"}} placeholder={title}/>
      <span onClick={method} id={`add-${name}-btn`}>
        <MdAdd size="1.5rem" />
      </span>
    </div>
  );
};

export default CustomSearch;
