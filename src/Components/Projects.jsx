import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { projects } from "../Data/Projects";

const Projects = ({ scrollPosition }) => {
  const [activeProject, setActiveProject] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [animatingProjects, setAnimatingProjects] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = parseInt(entry.target.dataset.projectId);
            setVisibleProjects((prev) => [...prev, projectId]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const projectElements = document.querySelectorAll("[data-project-id]");
    projectElements.forEach((el) => observer.observe(el));

    return () => projectElements.forEach((el) => observer.unobserve(el));
  }, []);

  // Rest of your code...

  const toggleProjectOverview = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();

    if (expandedProjects[projectId]) {
      // Start collapse animation
      setAnimatingProjects((prev) => ({
        ...prev,
        [projectId]: "collapsing",
      }));

      // Wait for animation to complete before removing from DOM
      setTimeout(() => {
        setExpandedProjects((prev) => ({
          ...prev,
          [projectId]: false,
        }));
        setAnimatingProjects((prev) => ({
          ...prev,
          [projectId]: null,
        }));
      }, 300); // Match this with your animation duration
    } else {
      // Expand immediately
      setExpandedProjects((prev) => ({
        ...prev,
        [projectId]: true,
      }));
      setAnimatingProjects((prev) => ({
        ...prev,
        [projectId]: "expanding",
      }));
    }
  };

  // Add scroll position effect to close expanded projects on scroll
  useEffect(() => {
    // Check if any projects are expanded
    const hasExpandedProjects = Object.values(expandedProjects).some(
      (value) => value
    );

    if (hasExpandedProjects) {
      // Store current expanded projects to check against
      const currentlyExpanded = { ...expandedProjects };

      // Start collapsing animation for all expanded projects
      const updatedAnimating = {};
      Object.keys(currentlyExpanded).forEach((projectId) => {
        if (currentlyExpanded[projectId]) {
          updatedAnimating[projectId] = "collapsing";
        }
      });

      setAnimatingProjects((prev) => ({
        ...prev,
        ...updatedAnimating,
      }));

      // After animation completes, close all projects
      setTimeout(() => {
        setExpandedProjects({});
        setAnimatingProjects({});
      }, 300);
    }
  }, [scrollPosition]); // React to changes in scrollPosition prop

  // Add the keyframes and animation styles
  const animationStyles = `
    @keyframes expand {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes collapse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(0);
        opacity: 0;
      }
    }
    
    @keyframes rotatePlus {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(60deg);
      }
    }
    
    @keyframes rotateMinus {
      0% {
        transform: rotate(60deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  `;

  return (
    <motion.section
      id="projects"
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen z-10 bg-[rgb(22 24 22/1)] shadow-[0_0_80px_20px_rgba(0,0,0,0.8)] flex p-4 sm:p-8 md:p-16 flex-col items-center"
    >
      <style>{animationStyles}</style>
      <div className="container flex flex-col items-center sm:mx-auto sm:py-4 sm:px-6 md:px-12 mt-8 md:mt-16 lg:mt-20">
        <div className="w-full flex flex-col gap-16 mb-4 sm:px-4 md:px-0">
          <h1 className="text-white text-center mb-4 text-4xl font-bold">{`<Projects />`}</h1>
        </div>

        <div className="w-full flex flex-col gap-20 md:gap-[20vh] sm:px-4 md:px-0">
          {projects.map((project, index) => (
            <div
              key={project.id}
              data-project-id={project.id}
              className={`${
                project.color
              } sticky shadow-[0_-15px_50px_-5px_rgba(0,0,0,0.5)] text-black rounded-3xl overflow-hidden group w-full h-full transition-all duration-500 relative ${
                index < activeProject ? "backdrop-blur-sm" : ""
              }`}
              style={{ top: `${5 + index * 2}rem` }}
            >
              <a
                href={project.url}
                target="_blank"
                aria-label={`View project: ${project.title}`}
                rel="noopener noreferrer"
                className="block w-full h-full"
                onClick={(e) =>
                  expandedProjects[project.id] && e.preventDefault()
                }
              >
                {visibleProjects.includes(project.id) ? (
                  <img
                    alt={project.alt}
                    loading="lazy"
                    width="1024"
                    height="728"
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-500"
                    src={project.image}
                    srcSet={`${project.image} 1x, ${project.image} 2x`}
                  />
                ) : (
                  <div
                    className={`w-full h-full ${project.color} animate-pulse`}
                  ></div>
                )}
              </a>

              {/* Info toggle button */}
              <button
                onClick={(e) => toggleProjectOverview(e, project.id)}
                className={`absolute bottom-4 right-4 ${
                  index === projects.length - 2
                    ? "lg:bottom-15"
                    : "lg:bottom-10"
                } lg:right-10 w-10 h-10 lg:w-15 lg:h-15 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 z-40 ${
                  expandedProjects[project.id] ||
                  animatingProjects[project.id] === "expanding"
                    ? "bg-transparent shadow-none border-0"
                    : index === 0
                    ? "bg-white/90 text-black shadow-[0_0_10px_rgba(0,0,0,0.3)] border border-gray-300 hover:bg-white" // Enhanced shadow for first project
                    : "bg-white/90 text-black shadow-lg hover:bg-white" // Original style for other projects
                }`}
                aria-label={
                  expandedProjects[project.id]
                    ? "Close project details"
                    : "View project details"
                }
              >
                {/* Single plus icon that rotates */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    transform:
                      expandedProjects[project.id] &&
                      !animatingProjects[project.id]
                        ? "rotate(60deg)" // Static rotation when fully expanded
                        : !expandedProjects[project.id] &&
                          !animatingProjects[project.id]
                        ? "rotate(0deg)" // Static rotation when fully collapsed
                        : "", // Let the animation handle the in-between states
                    animation:
                      animatingProjects[project.id] === "expanding"
                        ? "rotatePlus 0.3s forwards"
                        : animatingProjects[project.id] === "collapsing"
                        ? "rotateMinus 0.3s forwards"
                        : "none",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {/* Project overview box */}
              {(expandedProjects[project.id] ||
                animatingProjects[project.id] === "collapsing") && (
                <div
                  className="absolute shadow-[0_0_80px_20px_rgba(0,0,0,0.8)] bottom-5 left-5 right-5 lg:left-auto lg:w-[30%] bg-white lg:text-lg text-xs text-black p-4 sm:p-6 z-10 rounded-xl overflow-y-auto"
                  style={{
                    animation:
                      animatingProjects[project.id] === "collapsing"
                        ? "collapse 0.3s ease-in forwards"
                        : "expand 0.3s ease-out forwards",
                    transformOrigin: "bottom right",
                    maxHeight: "calc(100% - 2.5rem)", // Ensure it doesn't exceed the height of the card minus the bottom margin
                  }}
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {project.title || project.alt}
                  </h3>
                  <p className="mb-4 text-sm sm:text-base">
                    {project.overview}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-black text-white hover:bg-white border-1 border-black hover:text-black rounded-md transition-colors font-medium"
                    >
                      Visit Project
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Projects;
