import React, { useState, useEffect } from "react";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(0); // Track the active project
  const projects = [
    {
      id: 1,
      image: "/src/assets/images/pop-penha.png",
      alt: "POP Penha",
      title: "POP Penha Website",
      description:
        "The POP Penha allows active participation in the management of the Parish by submitting proposals and voting.",
      url: "https://pop-penha.pt",
      color: "bg-gray-700", // Blue
    },
    {
      id: 2,
      image: "/src/assets/images/opjovem.png",
      alt: "OP Jovem",
      title: "OP Jovem Website",
      description:
        "The Youth Participatory Budget (OP Jovem) is a democratic participation process in which citizens aged between 14 and 30 can take part by creating proposals and voting.",
      url: "https://opjovem.gov.pt",
      color: "bg-gray-700", // Purple
    },
    {
      id: 3,
      image: "/src/assets/images/lisboaparticipa.png",
      alt: "Lisboa Participa",
      title: "Lisboa Participa Website",
      description: "Participation Portal of the Lisbon City Council.",
      url: "https://lisboaparticipa.pt",
      color: "bg-grey-700", // Green
    },
    {
      id: 4,
      image: "/src/assets/images/workinprogress.gif",
      alt: "work in progress",
      title: "",
      description: "Many more projects will appear in this section.",
      url: "",
      color: "bg-yellow-500", // Yellow
    },
  ];

  // Handle scroll to update the active project
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const projectHeights = projects.map((_, index) => {
        const projectTop = 5 * 16 + index * 32; // Convert rem and px to pixels
        return projectTop;
      });

      // Find the active project based on scroll position
      const activeIndex = projectHeights.findIndex(
        (top, index) =>
          scrollPosition >= top &&
          (index === projects.length - 1 ||
            scrollPosition < projectHeights[index + 1])
      );

      setActiveProject(activeIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [projects]);

  return (
    <section
      id="projects"
      className="w-full min-h-screen z-10 shadow-[0_-80px_80px_-80px_rgba(0,0,0,0.8)] flex relative py-16 flex-col items-center"
    >
      <div className="max-w-4xl w-full flex flex-col gap-16 mb-4 px-4 md:px-0">
        <h1 className="text-white text-center mb-4 text-4xl font-bold">{`<Projects />`}</h1>
      </div>

      <div className="max-w-4xl w-full flex flex-col gap-20 md:gap-[20vh] px-4 md:px-0">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`sticky shadow-[0_-15px_50px_-5px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden group w-full h-[400px] transition-all duration-500 ${
              index < activeProject ? "backdrop-blur-sm" : ""
            }`}
            style={{ top: `calc(5rem + ${index * 32}px)` }}
          >
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <div className={`p-7 ${project.color} bg-opacity-90`}>
                <h2 className="text-white text-xl font-bold">
                  {project.title}
                </h2>
                <p className="text-gray-100 mb-4">{project.description}</p>
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
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
