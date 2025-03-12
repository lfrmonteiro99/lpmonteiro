import React from "react";

export default function NavbarMobile({ isOpen, setIsOpen, active, setActive }) {
  return (
    <div
      className={`${
        isOpen
          ? "absolute top-0 left-0 h-screen w-full text-center flex flex-col z-40 gap-5 bg-gray-500/50"
          : "hidden"
      }`}
    >
      <button
        className="p-2 rounded-full text-white hover:text-gray-800 focus:outline-none"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        &times;
      </button>
      <br />
      <a
        href="#home"
        onClick={() => {
          setActive("home");
        }}
        className={`py-2 pl-3 pr-4 sm:text-xl md:text-lg rounded md:p-0 ${
          active === "home" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
        } hover:text-white`}
      >
        Home
      </a>
      <a
        href="#skills"
        onClick={() => {
          setActive("skills");
        }}
        className={`py-2 pl-3 pr-4 sm:text-xl md:text-lg rounded md:p-0 ${
          active === "skills" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
        }text-[#ADB7BE] hover:text-white`}
      >
        Skills
      </a>
      <a
        href="#about"
        className={`py-2 pl-3 pr-4 sm:text-xl md:text-lg rounded md:p-0 ${
          active === "about" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
        }text-[#ADB7BE] hover:text-white`}
      >
        About
      </a>
      <a
        href="#projects"
        className={`py-2 pl-3 pr-4 sm:text-xl md:text-lg rounded md:p-0 ${
          active === "projects" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
        }text-[#ADB7BE] hover:text-white`}
      >
        Projects
      </a>
    </div>
  );
}
