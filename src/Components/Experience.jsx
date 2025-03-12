import React from "react";

export default function Experience() {
  const experiences = [
    {
      title: "Neobrain",
      role: "Software Developer",
      timeframe: "September 2023 - Present",
      description:
        "At Neobrain, I contribute to developing and maintaining an HR management platform, focusing on scalability, efficiency, and performance in an agile environment. Key responsibilities include developing and enhancing features, conducting code reviews, writing unit tests, and using Git and Docker for version control and containerized environments. The team maintains comprehensive documentation, aligns development with business goals through KPIs, and uses CI/CD pipelines for efficient deployments. We’ve delivered significant performance improvements using RabbitMQ and Elasticsearch for better data processing and scalability. Main technologies include Symfony, PHP, JavaScript, Vue.js, MySQL, GitLab, Docker, and unit testing. This role has strengthened my expertise in high-performance web applications and scalable architecture.",
    },
    {
      title: "Devoteam Cyber Thrust",
      role: "Full Stack Developer",
      timeframe: "Jannuary 2022 – August 2023",
      description:
        "At Devoteam Cyber Trust, I contributed to a cybersecurity platform for vulnerability management, focusing on secure and efficient risk assessment. Responsibilities included developing and maintaining the platform using Symfony, PHP, JavaScript, HTML, CSS, and MySQL. The team conducted code reviews to ensure high-quality, secure code, used Docker for containerized environments, and Git for version control. This experience enhanced our expertise in secure software development, web application performance, and cybersecurity best practices. Main technologies: Symfony, PHP, JavaScript, MySQL, GitLab, Docker, and unit testing.",
    },
    {
      title: "Onesource, Ltd",
      role: "Full Stack Developer",
      timeframe: "August 2016 – December 2021",
      description:
        "At OneSource, I developed and maintained web platforms using Laravel, Vue.js, and Livewire, optimized databases (MySQL, MariaDB, PostgreSQL), and built APIs for seamless integration. I used Git and Docker for efficient workflows, conducted code reviews, and led performance optimizations. Additionally, I managed teams, improved workflows, and fostered collaboration in an agile environment, ensuring high-quality, scalable solutions aligned with business goals.",
    },
    {
      title: "University of Coimbra",
      role: "Full Stack Developer",
      timeframe: "June 2014 – August 2016",
      description:
        "As a Research Grant Holder at the University of Coimbra, I developed two web platforms: one for CSV file uploads, data processing, and PostgreSQL storage, and another for data visualization and analysis. I configured servers with Apache, designed efficient database structures, and built full-stack solutions using PHP, HTML5, JavaScript, jQuery, CSS3, and Bootstrap. This enhanced my skills in creating scalable, data-driven applications and optimizing database performance in an academic research environment.",
    },
  ];

  return (
    <section id="experience" className="min-h-screen pt-25">
      <h2 className="text-4xl font-bold text-center text-white mb-4 ">{`<Work Experience />`}</h2>
      <div className="container md:px-50">
        <div className="border-l border-white justify-center w-fit w-[50%] flex flex-col gap-7 pl-4 relative  text-justify">
          {experiences.map((experience, key) => {
            return (
              <div key={key} className="text-white flex flex-col ">
                <span className="absolute left-0 inline-flex h-3 w-3 -translate-x-1/2 rounded-full bg-sky-400 opacity-75"></span>
                <span className="ml-2 text-xs  -translate-y-1 text-[#ADB7BE]">
                  {experience.timeframe}
                </span>
                <p className="ml-2  text-[#60a5fa] font-bold  -translate-y-1">
                  {experience.role} at {experience.title}
                </p>
                <p className="ml-2   -translate-y-1">
                  {experience.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
