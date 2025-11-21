import React, { ChangeEvent, InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name?: string;
  value?: string;
  type?: string;
  accept?: string;
  required?: boolean;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

// components/FloatingInput.tsx
export default function FloatingInput({
  label,
  value = "",
  onChange,
  accept,
  name,
  type = "text",
  required,
}: FloatingInputProps) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        accept={accept}
        required={required}
        onChange={(e) => onChange(e)}
        className="
          peer w-full px-3 py-3 border border-gray-300 rounded-lg bg-white 
          text-gray-900 placeholder-transparent
          focus:outline-none focus:border-blue-500
          transition-all duration-200
        "
        placeholder=" "
      />

      <label
        className="
          absolute left-3 top-3 text-gray-500 pointer-events-none
          transition-all duration-200 
          peer-placeholder-shown:text-gray-400
          peer-placeholder-shown:top-3 
          peer-placeholder-shown:text-base

          peer-focus:top-0 
          peer-focus:text-xs 
          peer-focus:text-blue-500

          peer-not-placeholder-shown:top-0
          peer-not-placeholder-shown:text-xs
        "
      >
        {label}
      </label>
    </div>
  );
}
