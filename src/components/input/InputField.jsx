import React from 'react'
import Style from '../input/InputField.module.css'



const InputField = ({ placeholder, value, onChange }) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
                border: "none",
                outline: "none",
                padding: "8px",
                width: "100%",
                fontSize: "14px"
            }}
        />
    );
};

export default InputField