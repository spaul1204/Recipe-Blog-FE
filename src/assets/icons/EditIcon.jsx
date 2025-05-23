import React from "react";

const EditIcon = ({ className = "h-5 w-5" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16.862 3.487a2.06 2.06 0 112.915 2.914l-9.193 9.193a1 1 0 01-.39.242l-3.387 1.13a.25.25 0 01-.316-.316l1.13-3.387a1 1 0 01.242-.39l9.193-9.193z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.5 8.5v7A2.5 2.5 0 0117 18H7A2.5 2.5 0 014.5 15.5V7A2.5 2.5 0 017 4.5h7"
      />
    </svg>
  );
};

export default EditIcon;
