import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import utilityStyles from "../styles/utilities.module.css";

const CustomSelect = ({
  name,
  title,
  stateTracker,
  setStateTracker,
  onChangeHandler,
  options,
  value
}) => {
  const displayDropDown = () => {
    setStateTracker(true);
  };

  const hideDropDown = () => {
    setStateTracker(false);
  };

  return (
    <div name={name} id={name}>
      <div className={utilityStyles.filterOption}>
        <div id={`${name}Title`} style={{whiteSpace: "nowrap"}}>{value ? value : title}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={!stateTracker ? displayDropDown : hideDropDown}
        >
          {!stateTracker ? (
            <RiArrowDropDownLine size="2rem" />
          ) : (
            <RiArrowDropUpLine size="2rem" />
          )}
        </div>
      </div>
      {stateTracker ? (
        <div
          className={utilityStyles.filterResults}
          onClick={(e) => {
            onChangeHandler(e);
            setStateTracker(false);
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
