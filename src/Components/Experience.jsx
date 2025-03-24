import React, { useEffect, useRef, useState } from "react";
import { experiences } from "../Data/Experience";
import { motion, AnimatePresence } from "framer-motion";

export default function Experience() {
  const [expandedItems, setExpandedItems] = useState({});
  const [activeChapter, setActiveChapter] = useState(null);
  const experienceRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = experienceRefs.current.indexOf(entry.target);
          if (entry.isIntersecting && index !== -1) {
            setActiveChapter(index);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-100px 0px" }
    );

    experienceRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggleReadMore = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const chapterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        // Replace this problematic easing array
        // ease: [0.6, 0.05, -0.01, 0.9],
        // With one of these standard named easings:
        ease: "easeOut",
        // Or if you want a custom cubic-bezier, use the string format:
        // ease: "cubic-bezier(0.6, 0.05, 0.01, 0.9)",
        delay: index * 0.2,
      },
    }),
    hover: {
      scale: 1.02,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: i * 0.05,
      },
    }),
  };

  return (
    <section id="experience" className="min-h-screen pt-25 bg-[rgb(22,24,22)]">
      <div className="container mx-auto py-4 px-6 md:px-12 mt-16 md:mt-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold text-center text-white mb-8"
        >
          {`<Experience />`}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-white text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-lg text-[#ADB7BE]">
            My journey as a developer has been a story of growth, challenges,
            and continuous learning. Let me take you through the chapters of my
            professional adventure.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              ref={(el) => (experienceRefs.current[index] = el)}
              custom={index}
              variants={chapterVariants}
              whileHover="hover"
              className={`mb-20 ${activeChapter === index ? "z-10" : "z-0"}`}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Chapter indicator with floating animation */}
                <motion.div
                  className="flex-shrink-0 w-full md:w-1/4 text-center md:text-right"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                  }}
                >
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-pink-500 p-1 rounded-lg">
                    <div className="bg-[rgb(22,24,22)] px-4 py-2 rounded-md">
                      <span className="text-xs text-[#ADB7BE] block">
                        {experience.timeframe}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        Chapter {index + 1}
                      </h3>
                    </div>
                  </div>
                </motion.div>

                {/* Story content */}
                <div className="flex-grow md:w-3/4 bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 overflow-hidden">
                  <motion.h3
                    variants={titleVariants}
                    className="text-xl font-bold mb-2"
                  >
                    <span className="text-pink-400">{experience.title}</span>
                    <span className="text-[#60a5fa]"> - {experience.role}</span>
                  </motion.h3>

                  {/* Description container with animated transitions */}
                  {/* Description container with sequential fade out/fade in transitions */}
                  <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {!expandedItems[index] ? (
                        <motion.div
                          key="summary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            exit: { duration: 0.2 }, // Slightly faster exit for better pacing
                          }}
                        >
                          <p className="text-[#ADB7BE]">
                            {experience.description}
                          </p>
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleReadMore(index);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm mt-4 focus:outline-none transition-colors duration-200 flex items-center"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Continue this chapter
                            <motion.svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              animate={{ y: [0, 3, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </motion.svg>
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.1, // Small delay before fade-in starts
                          }}
                        >
                          <p className="text-[#ADB7BE]">
                            {experience.readMore}
                          </p>
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleReadMore(index);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm mt-4 focus:outline-none transition-colors duration-200 flex items-center"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Summarize this chapter
                            <motion.svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              animate={{ y: [0, -3, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </motion.svg>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Skills/technologies with staggered animation */}
                  {experience.skills && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h4 className="text-sm font-semibold text-[#ADB7BE] mb-2">
                        Tools of the trade:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.skills?.map((skill, skillIndex) => (
                          <motion.span
                            key={skillIndex}
                            custom={skillIndex}
                            variants={skillVariants}
                            className="px-2 py-1 text-xs rounded-md bg-blue-900/30 text-blue-300"
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "rgba(59, 130, 246, 0.3)",
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Animated connector between experiences */}
              {index < experiences.length - 1 && (
                <motion.div
                  className="flex justify-center my-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: 48,
                    transition: { delay: 0.5, duration: 0.8 },
                  }}
                >
                  <motion.div
                    className="w-0.5 bg-gradient-to-b from-blue-400 to-pink-400"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear",
                    }}
                  ></motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Journey continues indicator with typing animation */}
          <motion.div
            className="text-center mt-8 text-[#ADB7BE]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.p
              className="italic"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              The journey continues...
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
