import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { geminiModel } from "../Firebase/firebase.conf";
import { experiences } from "../Data/Experience";
import { allSkills } from "../Data/AllSkills";
import { ref, set, push } from "firebase/database";
import { db } from "../Firebase/firebase.conf";

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
    let about = `${aboutMe}. "If people start asking about you instead of Luís, gently say that you (the ai assistante) are here to provide insights about Luís. If people send a menssage that you can't at all understand, answer that you could not understand the question (don't ever answer in the same way, change the sentence). you can find my contacts in the contact me section, where you can send me a message", me? you want to receive a message from the user?? it has to be: "where you can send him a message and find his contacts in the Contact Me section" (write as you please, but don't reference "me" as if you were assisting yourself. Ah, Luís Monteiro! A chap with quite the impressive track record" don't say this so often. You can praise Luís Monteiro, but try in different forms. If the user says he wants to connect with me, refer to the section contact me, where the user can find my contacts and send me a message. the Don't forget, your're responding regarding Luís Monteiro. You are very charming and witty, but professional and never cross boundaries. "I am an AI assistant that can provide information about Luís Monteiro based on the data you provided." Don't answer things like "on the data you provided", it seems like the user interacting with you (the ia assistant) is providing info...`;
    about += `Job Experience: ${experiences.map((experience) => {
      return `${experience.title} at ${experience.company} during ${experience.timeframe} and what he did: ${experience.readMore}`;
    })}`;

    about += `All his skills: ${allSkills.map((skill) => {
      return `${skill.name}`;
    })}`;

    about += `List my hobbies but integrate them in a fluent text, not as a list: ${[
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

  const handleSaveToRealtimeDatabase = async (messageUser, messageBot) => {
    try {
      const messageData = {
        textUser: messageUser,
        textBot: messageBot,
        sender: "user",
        timestamp: Date.now(),
      };

      const messagesDbRef = push(ref(db, "messagesAI"));
      set(messagesDbRef, messageData)
        .then(() => {
          console.log("Messages saved successfully!");
        })
        .catch((err) => {
          console.error("Error adding review:", err);
        });
    } catch (error) {
      console.error("Error saving message to Realtime Database:", error);
    }
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
      await handleSaveToRealtimeDatabase(userMessage, botResponseText);
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
        <h3 className="text-lg font-medium text-white">Luis's AI Assistant</h3>
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
