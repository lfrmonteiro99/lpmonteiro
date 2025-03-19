import React from "react";
import { useIsInView } from "../Hooks/useIsInView";
import ChatBot from "./ChatBot";

export default function About({ scrollPosition }) {
  const [eleRef, isInView] = useIsInView();

  React.useEffect(() => {
    if (!eleRef.current) return;

    if (isInView) {
      eleRef.current.children[0].children[0].classList.remove(
        "animate-disappear"
      );
      eleRef.current.children[0].children[0].classList.add("animate-appearB");
    } else {
      eleRef.current.children[0].children[0].classList.remove(
        "animate-slideUp"
      );
      eleRef.current.children[0].children[0].classList.add("animate-disappear");
    }
  }, [isInView]);

  return (
    <section id="about" ref={eleRef} className="relative min-h-screen py-16">
      <div className="container mx-auto py-4 px-12 mt-16 md:mt-20 flex flex-col">
        <div className="text-white text-justify">
          <h2 className="text-4xl font-bold text-center text-white mb-4 ">{`<About me />`}</h2>
          <p className="text-base lg:text-lg mb-8">
            I am a passionate web developer with over 9 years of experience in
            creating scalable, high-performance web applications. My expertise
            spans across a wide range of technologies, including PHP,
            JavaScript, Laravel, Symfony, Vue.js, and MySQL, allowing me to
            contribute effectively to both front-end and back-end development.
            Throughout my career, I've worked in agile environments,
            collaborating closely with teams to deliver innovative solutions. I
            am driven by problem-solving, consistently seeking ways to optimize
            performance and enhance user experiences. My focus on writing clean,
            maintainable code is paired with a commitment to unit testing
            (PHPUnit), ensuring robust and reliable software. I have experience
            leading small development teams, guiding them in best practices, and
            fostering a culture of continuous improvement. Additionally, I am
            skilled in working with Docker, Git, Elasticsearch, and RabbitMQ,
            leveraging these tools to streamline workflows and improve
            application scalability and performance. In previous roles, I've had
            the opportunity to work on a variety of projects, from HR management
            platforms to cybersecurity solutions and data visualization tools.
            I'm always eager to learn new technologies and embrace challenges
            that push me to grow both professionally and personally. I am
            excited about the opportunity to collaborate with like-minded
            professionals and contribute to impactful, innovative projects that
            make a difference.
          </p>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-center text-white mb-6">
              Have questions? Chat with my IA assistant!
            </h3>
            <ChatBot />
          </div>
          <div className="pb-16 md:pb-24"></div>
        </div>
      </div>
    </section>
  );
}
