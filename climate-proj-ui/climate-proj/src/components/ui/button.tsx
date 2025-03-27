import { Link } from "react-router-dom";

interface NavButtonProps {
  to?: string; // Make `to` optional for general-purpose buttons
  variant?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button = ({ to, variant, className, children }: NavButtonProps) => {
  const buttonClasses = `${variant || "bg-gray-700"} ${className || ""} px-4 py-2 text-sm text-gray-300 hover:text-white rounded-md transition duration-300`;

  // If `to` is provided, use `Link`, otherwise use a plain button
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses}>
      {children}
    </button>
  );
};

export default Button;
