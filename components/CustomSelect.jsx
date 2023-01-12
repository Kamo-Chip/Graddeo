import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import utilityStyles from "../styles/utilities.module.css";
import candidateListStyles from "../styles/candidateList.module.css";
import { useState } from "react";

const CustomSelect = ({
  name,
  title,
  stateTracker,
  setStateTracker,
  onChangeHandler,
  options,
  value,
}) => {

  const [showOptions, setShowOptions] = useState(false); 

  const displayDropDown = () => {
    setShowOptions(true);
  };

  const hideDropDown = () => {
    setShowOptions(false);
  };

  return (
    <div name={name} id={name}>
      <div
        className={`${utilityStyles.filterOption} ${candidateListStyles.filterOption}`}
      >
        <div id={`${name}Title`} style={{ whiteSpace: "nowrap" }}>
          {value ? value : title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={!showOptions ? displayDropDown : hideDropDown}
        >
          {!showOptions ? (
            <RiArrowDropDownLine size="2rem" />
          ) : (
            <RiArrowDropUpLine size="2rem" />
          )}
        </div>
      </div>
      {showOptions ? (
        <div
          className={utilityStyles.filterResults}
          onClick={(e) => {
            onChangeHandler(e);
            setShowOptions(false);
          }}
        >
          {options.map((option, idx) => {
            return <span key={`${name}filterOption${idx}`}>{option}</span>;
          })}
        </div>
      ) : null}
    </div>
  );
};

export default CustomSelect;
