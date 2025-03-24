import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ scrollPosition }) {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const menuRef = useRef(null);

  // Memoize navigation items to prevent recreating on every render
  const navItems = React.useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "skills", label: "Skills" },
      { id: "experience", label: "Experience" },
      { id: "reviews", label: "Reviews" },
      { id: "contact", label: "Contact" },
    ],
    []
  ); // Empty dependency array means this only runs once

  // Handle scroll behavior for navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Determine if navbar should be visible based on scroll direction
      setVisible(
        prevScrollPos > currentScrollPos || // Scrolling up
          currentScrollPos < 100 || // Near the top
          isOpen // Menu is open
      );

      // Update scroll state for background effects
      setIsScrolled(currentScrollPos > 50);

      // Store current position for next comparison
      setPrevScrollPos(currentScrollPos);

      // Determine active section based on scroll position
      const sections = navItems.map((item) => document.getElementById(item.id));
      const currentSection = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });

      if (currentSection !== -1) {
        setActive(navItems[currentSection].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, isOpen, navItems]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Navbar animation variants
  const navbarVariants = {
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    hidden: {
      y: -100,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
  };

  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  // Toggle menu function
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        variants={navbarVariants}
        initial="visible"
        animate={visible ? "visible" : "hidden"}
        className={`fixed w-full h-16 md:h-20 top-0 z-50 flex justify-center items-center transition-all duration-300 ${
          isScrolled || isOpen
            ? "backdrop-blur-md bg-black/30 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="w-full container px-6 md:px-12 mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="py-4 md:py-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="#home"
              aria-label="Logo link to home section"
              className="text-white font-bold text-xl md:text-2xl hover:text-blue-400 transition-colors duration-300"
              onClick={() => setActive("home")}
            >
              Luís Monteiro
              <span className="text-blue-400">.</span>
            </a>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            className="hidden md:flex gap-8 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex gap-8">
              {navItems.map((item, index) => (
                <motion.div key={item.id} className="relative overflow-hidden">
                  <a
                    href={`#${item.id}`}
                    aria-label={`Link to ${item.label}`}
                    onClick={() => setActive(item.id)}
                    className={`text-lg px-2 py-1 transition-colors duration-300 block ${
                      active === item.id ? "text-white" : "text-[#ADB7BE]"
                    } hover:text-white`}
                  >
                    {item.label}
                  </a>
                  {active === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      layoutId="activeIndicator"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Optional: Add a CTA button */}
            <motion.a
              href="/cv_latest.pdf"
              className="ml-4 px-4 py-2 bg-white text-black hover:bg-transparent hover:text-white hover:border-white border-1 border-transparent font-medium text-sm hover:shadow-lg transition-all duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Download CV
            </motion.a>
          </motion.div>

          {/* Mobile Menu Toggle - Fixed to ensure it works */}
          <motion.button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-2 z-50 md:hidden cursor-pointer"
            onMouseDown={(e) => {
              // Prevent event bubbling
              e.preventDefault();
              e.stopPropagation();

              // Toggle menu state
              setIsOpen(!isOpen);

              // Log for debugging
              console.log("Button clicked, toggling menu to:", !isOpen);
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-5 flex flex-col justify-between relative pointer-events-none">
              <motion.span
                className="w-full h-0.5 bg-white rounded-full block"
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-full h-0.5 bg-white rounded-full block"
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-full h-0.5 bg-white rounded-full block"
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
          >
            <motion.div
              className="flex flex-col items-center justify-center h-full"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  variants={itemVariants}
                  onClick={() => {
                    setActive(item.id);
                    setIsOpen(false); // Ensure this closes the menu
                  }}
                  className={`w-full text-center text-2xl py-4 ${
                    active === item.id
                      ? "text-blue-400 font-semibold"
                      : "text-white"
                  } hover:text-blue-300 transition-colors duration-200`}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}

              {/* Mobile CV download button */}
              <motion.a
                href="/cv_latest.pdf"
                variants={itemVariants}
                className="mt-8 px-6 py-3 bg-white text-black hover:bg-transparent hover:text-white hover:border-white border-1 border-transparent font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download CV
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
