import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { geminiModel } from "../Firebase/firebase.conf";
import { experiences } from "../Data/Experience";
import { allSkills } from "../Data/AllSkills";

const ChatBot = () => {
  const aboutMe = `Driven by curiosity and a passion for innovation, Luís is a dedicated professional who thrives on solving complex challenges with both creativity and precision. With a keen eye for detail and a natural ability to think outside the box, they excel at transforming ideas into impactful solutions. Known for their excellent communication and interpersonal skills, Luís fosters a collaborative and inclusive environment, where diverse perspectives are valued. Their adaptability, empathy, and problem-solving mindset allow them to navigate change with ease, while their strong leadership and active listening skills ensure that team members feel heard and motivated. Whether managing projects, mentoring colleagues, or tackling technical issues, Luís brings a balance of expertise, enthusiasm, and emotional intelligence to every endeavor, consistently delivering results and inspiring those around them. I am a passionate web developer with over 9 years of experience in
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
            make a difference. My hobbies are: watch and play Football (soccer), programming, learning, watching movies and shows, reading, sleep, cooking, beach, cinema, gym, padel.`;

  const aboutYou = React.useMemo(() => {
    let about = `"you can find my contacts in the contact me section, where you can send me a message", me? you want to receive a message from the user?? it has to be: "where you can send him a message and find his contacts in the Contact Me section" (write as you please, but don't reference "me" as if you were assisting yourself. Ah, Luís Monteiro! A chap with quite the impressive track record" don't say this so often. You can praise Luís Monteiro, but try in different forms. If the user says he wants to connect with me, refer to the section contact me, where the user can find my contacts and send me a message. the Don't forget, your're responding regarding Luís Monteiro. You are very charming and witty, but professional and never cross boundaries. "I am an AI assistant that can provide information about Luís Monteiro based on the data you provided." Don't answer things like "on the data you provided", it seems like the user interacting with you (the ia assistant) is providing info...`;
    about += `Job Experience: ${experiences.map((experience) => {
      return `${experience.title} at ${experience.company} during ${experience.timeframe} and what he did: ${experience.readMore}`;
    })}`;

    about += `All his skills: ${allSkills.map((skill) => {
      return `${skill.name}`;
    })}`;

    about += `List my hobbies but in a fluent text: ${[
      "watch and play Football (soccer)",
      "programming",
      "learning",
      "watching movies and shows",
      "reading",
      "sleep",
      "cooking",
      "beach",
      "cinema",
      "gym",
      "padel",
    ].map((hobbie) => {
      return `${hobbie}`;
    })}`;

    return about;
  }, []);

  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm Luis's virtual assistant. Ask me anything about his experience, skills, or background!",
      sender: "bot",
      id: Date.now(),
    },
  ]);

  async function run(message) {
    try {
      const result = await geminiModel.generateContent(`${aboutYou}
        User question: ${message.text}`);

      const response = result.response;
      const text = response.text();
      console.log(text);
      return text;
    } catch (error) {
      console.error("Error with Gemini model:", error);
      throw new Error("Failed to get a response from the assistant");
    }
  }

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      // This ensures scrolling happens only within the chat container
      const chatContainer = document.getElementById("chat-container");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Predefined responses based on keywords
  const getBotResponse = (input) => {
    const lowercaseInput = input.toLowerCase();

    // Experience related questions
    if (
      lowercaseInput.includes("neobrain") ||
      (lowercaseInput.includes("current") && lowercaseInput.includes("job"))
    ) {
      return "At Neobrain, I architect scalable HR solutions using Symfony and Vue.js, delivering 40% faster performance through RabbitMQ optimization and containerized deployments.";
    }

    if (
      lowercaseInput.includes("experience") ||
      lowercaseInput.includes("work history")
    ) {
      return "I have over 9 years of experience in web development, working with companies like Neobrain where I focused on HR management platforms. I've also worked on cybersecurity solutions and data visualization tools.";
    }

    // Skills related questions
    if (
      lowercaseInput.includes("skills") ||
      lowercaseInput.includes("technologies")
    ) {
      return "My core skills include PHP (Laravel, Symfony), JavaScript (Vue.js, React), database management (MySQL, PostgreSQL, MongoDB), and DevOps (Docker, CI/CD). I'm particularly strong in building scalable, high-performance web applications.";
    }

    if (lowercaseInput.includes("backend") || lowercaseInput.includes("php")) {
      return "My backend expertise includes PHP with Laravel and Symfony frameworks. I implement SOLID principles and design patterns for maintainable, scalable code. I'm also experienced with MySQL, PostgreSQL, and MongoDB.";
    }

    if (
      lowercaseInput.includes("frontend") ||
      lowercaseInput.includes("javascript")
    ) {
      return "For frontend development, I work with JavaScript frameworks like Vue.js and React. I'm also proficient with TailwindCSS and Bootstrap for responsive, modern UI design.";
    }

    // Project related questions
    if (
      lowercaseInput.includes("project") ||
      lowercaseInput.includes("portfolio")
    ) {
      return "My portfolio includes projects like the Lisboa Participa website, OP Jovem, and POP Penha - all focused on civic participation platforms. These projects demonstrate my ability to build secure, user-friendly web applications with complex backend requirements.";
    }

    // Education and learning
    if (
      lowercaseInput.includes("education") ||
      lowercaseInput.includes("learn") ||
      lowercaseInput.includes("study")
    ) {
      return "I'm continuously learning and improving my skills. Currently, I'm deepening my knowledge in cloud architecture, microservices, and advanced JavaScript patterns.";
    }

    // Personal questions
    if (
      lowercaseInput.includes("hobby") ||
      lowercaseInput.includes("free time") ||
      lowercaseInput.includes("interest")
    ) {
      return "Outside of coding, I enjoy exploring new technologies, contributing to open-source projects, and staying updated with the latest web development trends.";
    }

    // Contact or hiring questions
    if (
      lowercaseInput.includes("contact") ||
      lowercaseInput.includes("hire") ||
      lowercaseInput.includes("email")
    ) {
      return "You can contact Luis through the contact form on this website or directly via email. He's currently open to discussing new opportunities!";
    }

    // CV or resume
    if (lowercaseInput.includes("cv") || lowercaseInput.includes("resume")) {
      return "You can download Luis's CV from this website. It contains detailed information about his professional experience, skills, and education.";
    }

    // Fallback responses
    const fallbacks = [
      "That's an interesting question! Luis would be happy to discuss that in more detail during a meeting.",
      "I don't have specific information about that, but you can ask Luis directly through the contact form.",
      "Great question! Luis has experience in that area and would be glad to elaborate further.",
      "I'm still learning about Luis's experience. Could you try asking in a different way or about another topic?",
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      text: inputValue,
      sender: "user",
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    try {
      const botResponseText = await run(userMessage);

      const botResponse = {
        text: botResponseText,
        sender: "bot",
        id: Date.now() + 1,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorResponse = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        id: Date.now() + 1,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">Luis's IA Assistant</h3>
        <p className="text-sm text-gray-300">
          Ask me anything about Luis's experience and skills
        </p>
      </div>

      <div
        className="h-96 overflow-y-auto p-4 custom-scrollbar"
        id="chat-container"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 animate-fadeIn ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {message.sender === "bot" ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-700 text-white rounded-lg px-4 py-2 flex items-center">
              <span className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-pulse"></span>
              <span
                className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-700 bg-gray-800/50"
      >
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about Luis..."
            className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
