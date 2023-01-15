import { useState } from "react";
import utilityStyles from "../styles/utilities.module.css";

const CustomTextArea = ({maxLength, name, handler, value, height, placeholder}) => {
    const [countLength, setCountLength] = useState(0);

    const changeLength = (e) => {
        setCountLength(e.target.value.length);
    }

  return (
    <>
      <textarea
        maxLength={maxLength}
        placeholder={placeholder}
        className={`${utilityStyles.input} ${utilityStyles.textarea}`}
        name={name}
        id={name}
        onInput={changeLength}
        onChange={handler}
        value={value}
        style={{height: height}}
      />
      <span style={{ textAlign: "right", marginTop: ".5rem" }}>
        {countLength}/{maxLength}
      </span>
    </>
  );
};

export default CustomTextArea;
