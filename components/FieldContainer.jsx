import utilityStyles from "../styles/utilities.module.css";

const FieldContainer = ({
  name,
  label,
  required,
  fieldType,
  smallText,
  labelId,
  icon,

}) => {
  return (
    <div className={`${utilityStyles.fieldContainer}`}>
      <div className={utilityStyles.labelContainer}>
        <label
          htmlFor={name}
          className={required ? `${utilityStyles.required} ${utilityStyles.headerTextNSmall}`: utilityStyles.headerTextNSmall}
          id={labelId ? labelId : ""}
          
        >
          {icon} {label}
        </label>
        {smallText ? (
          <small className={utilityStyles.grayedOutText} style={{marginLeft: ".5rem"}}>{smallText}</small>
        ) : null}
      </div>
      {fieldType}
    </div>
  );
};

export default FieldContainer;
