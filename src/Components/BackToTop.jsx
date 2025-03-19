import React, { useState, useEffect } from "react";
import { useTerminal } from "../Context/TerminalContext";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isTerminalOpen, isTerminalMinimized } = useTerminal();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Determine the button position based on terminal state
  const getButtonPosition = () => {
    if (isTerminalOpen && !isTerminalMinimized) {
      return "bottom-[calc(50vh+2rem)]"; // Terminal is open and not minimized
    } else {
      return "bottom-24"; // Terminal is closed or minimized
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-50 right-6 p-3 rounded-full bg-slate-700 text-white shadow-lg transition-all duration-300 hover:bg-slate-600 focus:outline-none ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${getButtonPosition()}`}
      aria-label="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
