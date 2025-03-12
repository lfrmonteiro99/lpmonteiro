import React from "react";

export default function Navbar() {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [active, setActive] = React.useState("home");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }
  }, [isOpen]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed w-full h-16 md:h-20 top-0 z-50 flex justify-center items-center ${
          scrollPosition > 50 || isOpen
            ? isOpen
              ? "backdrop-blur-sm bg-gray/30"
              : "backdrop-blur-sm bg-white/30"
            : "bg-transparent"
        }`}
      >
        <div className="w-full container px-12 mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="py-4 md:py-6">
            <a className="bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-transparent">
              Luís Monteiro
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-10">
            {["home", "projects", "about", "skills", "experience"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setActive(item)}
                  className={`text-lg ${
                    active === item ? "text-[#60a5fa]" : "text-[#ADB7BE]"
                  } hover:text-white`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                viewBox="0 0 384 512"
              >
                <path
                  fill="#ADB7BE"
                  d="M376.5 54.6c12.5 12.5 12.5 32.8 0 45.3L237.3 239.1 376.5 378.3c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L192 284.7 52.8 423.9c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L146.7 239.1 7.5 99.9C-5 87.4-5 67.1 7.5 54.6s32.8-12.5 45.3 0L192 193.8 331.2 54.6c12.5-12.5 32.8-12.5 45.3 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ADB7BE"
                  d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-gray-500/40 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
      >
        <div className="flex flex-col items-center pt-32 gap-6 h-full overflow-y-auto">
          {/* Menu items */}
          <a
            href="#home"
            onClick={() => {
              setActive("home");
              setIsOpen(false);
            }}
            className={`text-xl ${
              active === "home" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
            } hover:text-white`}
          >
            Home
          </a>
          <hr className="w-1/2 border-gray-600" />
          <a
            href="#about"
            onClick={() => {
              setActive("about");
              setIsOpen(false);
            }}
            className={`text-xl ${
              active === "about" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
            } hover:text-white`}
          >
            About
          </a>
          <hr className="w-1/2 border-gray-600" />
          <a
            href="#projects"
            onClick={() => {
              setActive("projects");
              setIsOpen(false);
            }}
            className={`text-xl ${
              active === "projects" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
            } hover:text-white`}
          >
            Projects
          </a>

          <a
            href="#skills"
            onClick={() => {
              setActive("skills");
              setIsOpen(false);
            }}
            className={`text-xl ${
              active === "skills" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
            } hover:text-white`}
          >
            Skills
          </a>
          <hr className="w-1/2 border-gray-600" />
          <a
            href="#experience"
            onClick={() => {
              setActive("experience");
              setIsOpen(false);
            }}
            className={`text-xl ${
              active === "experience" ? "text-[#60a5fa]" : "text-[#ADB7BE]"
            } hover:text-white`}
          >
            Work Experience
          </a>
          <hr className="w-1/2 border-gray-600" />
        </div>
      </div>
    </>
  );
}
