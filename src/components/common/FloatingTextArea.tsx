import { ChangeEvent } from "react";

// components/FloatingTextarea.tsx
type floatingTextareaProps = {
  label: string;
  value?: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  name?: string;
  required?: boolean;
  rows?: number;
};

export default function FloatingTextarea({
  label,
  value,
  onChange,
  name,
  required,
  rows = 4,
}: floatingTextareaProps) {
  return (
    <div className="relative w-full">
      <textarea
        name={name}
        value={value}
        required={required}
        rows={rows}
        onChange={(e) => onChange(e)}
        className="
          peer w-full px-3 py-3 border border-gray-300 rounded-lg bg-white 
          text-gray-900 placeholder-transparent
          focus:outline-none focus:border-blue-500
          transition-all duration-200
          resize-none
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
