import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition duration-300 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;