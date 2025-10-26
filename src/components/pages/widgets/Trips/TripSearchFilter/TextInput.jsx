import React from "react";

const TextInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  type = "text", 
  placeholder = "" 
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="p-2 border border-gray-300 rounded-md w-full 
                 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
    />
  </div>
);

export default TextInput;
