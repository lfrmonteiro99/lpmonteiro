import React from "react";
import { useTerminal } from "../Context/TerminalContext";

const TerminalButton = () => {
  const {
    isTerminalOpen,
    isTerminalMinimized,
    openTerminal,
    maximizeTerminal,
  } = useTerminal();

  const handleClick = () => {
    if (!isTerminalOpen) {
      openTerminal();
    } else if (isTerminalMinimized) {
      maximizeTerminal();
    }
  };

  // Don't show button if terminal is already open and maximized
  if (isTerminalOpen && !isTerminalMinimized) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 text-black bg-white p-4 cursor-pointer rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40 animate-bounce"
      title={isTerminalMinimized ? "Maximize Terminal" : "Open Terminal"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          fill="#00000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </button>
  );
};

export default TerminalButton;
