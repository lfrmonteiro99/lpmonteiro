import React from "react";

export default function Navbar({ scrollPosition }) {
  const [active, setActive] = React.useState("home");
  const [isOpen, setIsOpen] = React.useState(false);
  const eleRef = React.useRef(null);

  const appearAnimations = [
    "animate-appearT",
    "animate-appear",
    "animate-appearR",
  ];

  React.useEffect(() => {
    const index = Math.floor(Math.random() * appearAnimations.length);
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
      eleRef.current.classList.remove("animate-disappear");
      eleRef.current.classList.add(appearAnimations[index]);
    } else {
      eleRef.current.classList.remove("animate-*");
      eleRef.current.classList.add("animate-disappear");
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }
  }, [isOpen]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed w-full h-16 md:h-20 top-0 z-50 flex justify-center items-center ${
          scrollPosition > 100 || isOpen
            ? isOpen
              ? "backdrop-blur-sm bg-gray/30"
              : "backdrop-blur-sm bg-white/30"
            : "bg-transparent"
        }`}
      >
        <div className="w-full container px-12 mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="py-4 md:py-6">
            <a
              href="#home"
              aria-label="Logo link to home section"
              className="text-white"
            >
              Luís Monteiro
            </a>
          </div>

          {/* Desktop Menu */}
          {/* <div className="hidden md:flex gap-10">
            {["home", "projects", "about", "skills", "experience"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  aria-label={`Link to ${item}`}
                  onClick={() => setActive(item)}
                  className={`text-lg ${
                    active === item ? "text-[#60a5fa]" : "text-[#ADB7BE]"
                  } hover:text-white`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              )
            )}
          </div> */}

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Button to open mobile menu"
            className="p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
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
        ref={eleRef}
        className={`fixed inset-0 z-40 bg-gray-500/40 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } `}
      >
        <div className="flex flex-col items-center pt-32 gap-5 h-full ">
          {["home", "projects", "about", "skills", "experience"].map(
            (item, index) => {
              return (
                <a
                  key={index}
                  href={`#${item}`}
                  aria-label={`Link to ${item}`}
                  onClick={() => {
                    setActive(item);
                    setIsOpen(false);
                  }}
                  className={`w-full text-center text-xl ${
                    active === item ? "text-[#60a5fa]" : "text-[#ADB7BE]"
                  } hover:text-white`}
                >
                  <hr className="mb-5 border-gray-500/80"></hr>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}
