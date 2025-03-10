import React from "react";

export default function Navbar() {
  const [scrollPosition, setScrollPosition] = React.useState();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

return (
    <>
<nav className={`fixed w-full top-0 z-50 sm:px-16 px-6 flex justify-center items-center ${scrollPosition > 100 ? "backdrop-blur-sm bg-white/30" : ''}`}>
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full container flex text-white justify-between">
  <div className="md:mx-auto px-4 py-4 md:py-6 md:px-6 w-full">
  <a className="bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-transparent">Luís Monteiro</a>
  </div>
  <div className="flex hidden md:flex gap-10 transition-padding justify-end flex container flex-wrap items-center mx-auto px-4 py-2 md:py-6 md:px-6">
  <a href="#home" className="py-2 pl-3 pr-4 sm:text-xl md:text-lg rounded md:p-0 text-[#ADB7BE] hover:text-white">Home</a>
  <a href="#about" className="py-2 pl-3 pr-4 sm:text-xl md:text-lg rounded md:p-0 text-[#ADB7BE] hover:text-white">About</a>
  <a href="#projects" className="py-2 pl-3 pr-4 sm:text-xl md:text-lg rounded md:p-0 text-[#ADB7BE] hover:text-white">Projects</a>
  </div>
  <div className="md:hidden rounded-full px-4 py-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="36px" viewBox="0 0 448 512"><path fill="#ADB7BE" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
  </div>
  </div>
</nav>
</>
);
}