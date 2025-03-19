import React, { createContext, useState, useContext, useEffect } from "react";
import Terminal from "../Components/Terminal";

const TerminalContext = createContext();

export const TerminalProvider = ({ children }) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [autoMinimize, setAutoMinimize] = useState(true); // Control auto-minimize behavior

  const openTerminal = () => {
    setIsTerminalOpen(true);
    setIsTerminalMinimized(false);
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
  };

  const minimizeTerminal = () => {
    setIsTerminalMinimized(true);
  };

  const maximizeTerminal = () => {
    setIsTerminalMinimized(false);
  };

  const toggleAutoMinimize = () => {
    setAutoMinimize(!autoMinimize);
  };

  // Track scroll position to auto-minimize when leaving About section
  useEffect(() => {
    if (!autoMinimize || !isTerminalOpen) return;

    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (!aboutSection) return;

      const aboutRect = aboutSection.getBoundingClientRect();
      const isInAboutSection = aboutRect.top <= 0 && aboutRect.bottom >= 0;

      // Auto-minimize when scrolling out of the About section
      if (!isInAboutSection && !isTerminalMinimized) {
        setIsTerminalMinimized(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTerminalOpen, isTerminalMinimized, autoMinimize]);

  return (
    <TerminalContext.Provider
      value={{
        isTerminalOpen,
        isTerminalMinimized,
        autoMinimize,
        openTerminal,
        closeTerminal,
        minimizeTerminal,
        maximizeTerminal,
        toggleAutoMinimize,
      }}
    >
      {children}

      {/* Floating Terminal */}
      {isTerminalOpen && (
        <div
          className={`fixed transition-all duration-300 ease-in-out z-50 ${
            isTerminalMinimized
              ? "bottom-0 opacity-0 right-0 w-48 h-10"
              : "bottom-4 right-4 p-l2 opacity-100 w-full max-w-4xl h-[500px]"
          }`}
        >
          <div className="w-full h-full pl-4">
            <Terminal
              onMinimize={minimizeTerminal}
              onClose={closeTerminal}
              autoMinimize={autoMinimize}
              onToggleAutoMinimize={toggleAutoMinimize}
            />
          </div>
        </div>
      )}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => useContext(TerminalContext);
