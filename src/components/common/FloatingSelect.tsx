"use client";
import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";

// components/FloatingSelect.tsx
type FloatingSelectProps = {
  label: string;
  initial: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  name?: string;
  required?: boolean;
  options?: { id: string; name: string }[];
};

export default function FloatingSelect({
  label,
  initial,
  value,
  disabled,
  onChange,
  className,
  name,
  required,
  options = [],
}: FloatingSelectProps) {
  const hasValue = value && value !== "";

  return (
    <div className="relative w-full">
      <select
        name={name}
        required={required}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e)}
        className={cn(
          `
          peer w-full px-3 py-3 border border-gray-300 rounded-lg bg-white 
          text-gray-900 truncate
          focus:outline-none focus:border-blue-500
          transition-all duration-200 appearance-none
        `,
          className,
          disabled ? "text-gray-300 cursor-not-allowed" : ""
        )}
      >
        <option value="">{initial}</option>

        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      <label
        className={`
          absolute left-3 transition-all duration-200 pointer-events-none
          ${
            hasValue
              ? "top-0 text-xs text-blue-500"
              : "top-3 text-base text-gray-500"
          }
          peer-focus:top-0
          peer-focus:text-xs
          peer-focus:text-blue-500

          peer-not-placeholder-shown:top-0
          peer-not-placeholder-shown:text-xs
        `}
      >
        {label}
      </label>

      {/* Chevron Icon */}
      <div
        className={cn(
          `pointer-events-none absolute right-3 top-4 text-gray-500`,
          disabled ? "text-gray-300" : ""
        )}
      >
        ▼
      </div>
    </div>
  );
}
