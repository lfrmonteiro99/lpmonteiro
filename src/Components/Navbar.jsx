import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithGoogle } from "../Firebase/signin";

export default function Navbar({ scrollPosition }) {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  // Memoize navigation items to prevent recreating on every render
  const navItems = React.useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "blog", label: "Blog" },
      { id: "projects", label: "Projects" },
      { id: "skills", label: "Skills" },
      { id: "experience", label: "Experience" },
      { id: "reviews", label: "Reviews" },
      { id: "contact", label: "Contact" },
    ],
    []
  ); // Empty dependency array means this only runs once

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithGoogle();
      setUser(response.user.email);
      localStorage.setItem("user", response.user.email);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

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
            className="hidden xl:flex gap-8 items-center"
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

            {/* Auth and CV buttons */}
            <div className="flex items-center gap-4">
              {user ? (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleGoogleSignIn}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#ffffff"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Sign in
                </motion.button>
              )}

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
            </div>
          </motion.div>

          {/* Mobile Menu Toggle - Fixed to ensure it works */}
          <motion.button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-2 z-50 xl:hidden cursor-pointer"
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
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md xl:hidden"
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
                    setIsOpen(false);
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

              {/* Mobile Auth and CV buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-4 mt-4"
              >
                {user ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="text-white hover:text-blue-400 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#ffffff"
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                )}
                <motion.a
                  href="/cv_latest.pdf"
                  variants={itemVariants}
                  className="px-6 py-3 bg-white text-black hover:bg-transparent hover:text-white hover:border-white border-1 border-transparent font-medium text-center w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download CV
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
