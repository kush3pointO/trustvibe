import React from 'react';

interface TextFieldUnstyledProps {
  children: React.ReactNode;
  className?: string;
}

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}

function Input({ placeholder, value, onChange, type = 'text', disabled = false }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-transparent border-none outline-none text-body placeholder:text-subtext-color"
    />
  );
}

export function TextFieldUnstyled({ children, className = '' }: TextFieldUnstyledProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {children}
    </div>
  );
}

TextFieldUnstyled.Input = Input;
