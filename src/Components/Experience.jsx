import React, { useEffect, useRef, useState } from "react";
import { experiences } from "../Data/Experience";

export default function Experience() {
  const [experienceStates, setExperienceStates] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [animationState, setAnimationState] = useState({}); // track animation states
  const experienceRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = experienceRefs.current.indexOf(entry.target);
          setExperienceStates((prev) => ({
            ...prev,
            [index]: {
              isVisible: entry.isIntersecting,
              isExiting: !entry.isIntersecting && prev[index]?.isVisible,
            },
          }));
        });
      },
      { threshold: 0.2 }
    );

    experienceRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggleReadMore = (index) => {
    // Prevent multiple clicks during animation
    if (animationState[index]) return;

    const isExpanding = !expandedItems[index];

    // Start fadeOut animation
    setAnimationState((prev) => ({
      ...prev,
      [index]: isExpanding ? "collapsing-out" : "expanding-out",
    }));

    // After fadeOut completes, start fadeIn animation
    setTimeout(() => {
      setExpandedItems((prev) => ({
        ...prev,
        [index]: isExpanding,
      }));

      setAnimationState((prev) => ({
        ...prev,
        [index]: isExpanding ? "expanding-in" : "collapsing-in",
      }));

      // After fadeIn completes, reset animation state
      setTimeout(() => {
        setAnimationState((prev) => ({
          ...prev,
          [index]: null,
        }));
      }, 500); // Duration of fadeIn animation
    }, 500); // Duration of fadeOut animation
  };

  return (
    <section id="experience" className="min-h-screen pt-25">
      <div className="container mx-auto py-4 px-12 mt-16 md:mt-20">
        <h2 className="text-4xl font-bold text-center text-white mb-4">{`<Experience />`}</h2>
        <div className="container md:px-50">
          <div className="border-l border-white flex flex-col">
            {experiences.map((experience, index) => (
              <div
                key={index}
                ref={(el) => (experienceRefs.current[index] = el)}
                className={`
                 pl-4 relative text-justify
                transition-all duration-500
                mb-16 
                ${
                  experienceStates[index]?.isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[-20px] opacity-0"
                }
                ${
                  experienceStates[index]?.isExiting ? "translate-x-[20px]" : ""
                }
              `}
              >
                <span className="absolute left-0 top-[0.625rem] h-3 w-3 -translate-x-1/2 rounded-full bg-blue-400 opacity-75"></span>
                <span className="ml-2 text-xs text-[#ADB7BE]">
                  {experience.timeframe}
                </span>
                <p className="ml-2 text-[#60a5fa] font-bold">
                  {experience.role} at{" "}
                  <span className="text-pink-400">{experience.title}</span>
                </p>

                {/* Description container */}
                <div className="ml-2 text-white relative min-h-[80px]">
                  {/* Truncated description */}
                  <div
                    className={`w-full transition-all duration-500 ${
                      (!expandedItems[index] && !animationState[index]) ||
                      animationState[index] === "collapsing-in"
                        ? "opacity-100 relative z-10"
                        : animationState[index] === "collapsing-out"
                        ? "animate-fadeOut relative z-10"
                        : "opacity-0 absolute top-0 left-0 z-0"
                    }`}
                  >
                    <p>{experience.description}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleReadMore(index);
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm mt-2 focus:outline-none transition-colors duration-200"
                    >
                      Read More
                    </button>
                  </div>

                  {/* Full description */}
                  <div
                    className={`w-full transition-all duration-500 ${
                      (expandedItems[index] && !animationState[index]) ||
                      animationState[index] === "expanding-in"
                        ? "opacity-100 relative z-10"
                        : animationState[index] === "expanding-out"
                        ? "animate-fadeOut relative z-10"
                        : "opacity-0 absolute top-0 left-0 z-0"
                    }`}
                  >
                    <p>{experience.readMore}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleReadMore(index);
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm mt-2 focus:outline-none transition-colors duration-200"
                    >
                      Show Less
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
