import React, { useState, useEffect, useRef } from "react";
import { stacks } from "../Data/Stacks";
import { experiences } from "../Data/Experience";
import { allSkills } from "../Data/AllSkills";

export default function Terminal({
  onMinimize,
  onClose,
  autoMinimize,
  onToggleAutoMinimize,
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([
    { text: "Welcome to Luis Monteiro's experience terminal.", type: "system" },
    { text: 'Type "help" to see available commands.', type: "system" },
    { text: "", type: "break" },
  ]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Available commands
  const commands = {
    help: {
      description: "Show available commands",
      action: () => {
        return [
          { text: "Available commands:", type: "system" },
          { text: "", type: "break" },
          ...Object.keys(commands).map((cmd) => ({
            text: `${cmd.padEnd(15)} - ${commands[cmd].description}`,
            type: "system",
          })),
        ];
      },
    },
    clear: {
      description: "Clear the terminal",
      action: () => {
        setOutput([]);
        return [];
      },
    },
    ls: {
      description: "List all years of experience",
      action: () => {
        return [
          { text: "Years of experience:", type: "system" },
          { text: "", type: "break" },
          ...stacks.map((exp) => ({
            text: exp.year.toString(),
            type: "result",
            color: exp.color,
          })),
        ];
      },
    },
    skills: {
      description: "List all skills across all years",
      action: () => {
        const output = [
          { text: "All skills by category:", type: "system" },
          { text: "", type: "break" },
        ];

        allSkills.forEach((category) => {
          output.push({
            text: category.category + ":",
            type: "year",
            color: "#34d399",
          });
          category.skills.forEach((skill) => {
            output.push({ text: `  - ${skill}`, type: "result" });
          });
          output.push({ text: "", type: "break" });
        });

        return output;
      },
    },
    skillsbycategory: {
      description:
        "List all skills organized by category (usage: skillsbycategory frontend)",
      action: () => {
        const output = [
          { text: "Skills by category:", type: "system" },
          { text: "", type: "break" },
        ];

        allSkills.forEach((category) => {
          output.push({
            text: category.category + ":",
            type: "year",
            color: "#34d399",
          });
          category.skills.forEach((skill) => {
            output.push({ text: `  - ${skill}`, type: "result" });
          });
          output.push({ text: "", type: "break" });
        });

        return output;
      },
    },
    experiences: {
      description: "List all experiences",
      action: () => {
        return [
          { text: "All experiences:", type: "system" },
          { text: "", type: "break" },
          ...experiences.map((exp) => ({
            text: `${exp.timeframe} - ${exp.role} at ${exp.title}`,
            type: "result",
            color: exp.color,
          })),
        ];
      },
    },
    workyear: {
      description:
        "Show where I was working in a specific year (usage: workyear 2022)",
      action: (args) => {
        if (!args.length) {
          return [
            {
              text: "Error: Please specify a year (e.g., workyear 2022)",
              type: "error",
            },
          ];
        }

        const year = parseInt(args[0]);

        // Find experiences that match the given year
        const matchingExperiences = experiences.filter((exp) => {
          // Check if timeframe exists
          if (!exp.timeframe) {
            return false;
          }

          try {
            // Handle different types of dashes by replacing them all with a standard format
            const standardizedTimeframe = exp.timeframe
              .replace(/–/g, "-") // Replace en dash
              .replace(/—/g, "-") // Replace em dash
              .replace(/\s*-\s*/g, " - "); // Standardize spacing around dash

            // Check if the standardized timeframe has the expected format
            if (!standardizedTimeframe.includes(" - ")) {
              return false;
            }

            // Parse the timeframe to extract years
            const timeframeParts = standardizedTimeframe.split(" - ");

            // Extract the year from the start date
            const startDateParts = timeframeParts[0].split(" ");
            const startYear = parseInt(
              startDateParts[startDateParts.length - 1]
            );

            // Extract the year from the end date or use current year if "Present"
            let endYear;
            if (timeframeParts[1].includes("Present")) {
              endYear = new Date().getFullYear();
            } else {
              const endDateParts = timeframeParts[1].split(" ");
              endYear = parseInt(endDateParts[endDateParts.length - 1]);
            }

            // Check if the specified year falls within the experience timeframe
            const isMatch =
              !isNaN(startYear) &&
              !isNaN(endYear) &&
              year >= startYear &&
              year <= endYear;

            console.log("Is match?", isMatch);
            return isMatch;
          } catch (error) {
            // If any error occurs during parsing, skip this experience
            console.error(`Error parsing timeframe for ${exp.title}:`, error);
            return false;
          }
        });

        console.log("Matching experiences:", matchingExperiences);

        if (!matchingExperiences.length) {
          return [
            {
              text: `No work experience found for year ${year}`,
              type: "error",
            },
          ];
        }

        return [
          { text: `In ${year}, I was working at:`, type: "system" },
          { text: "", type: "break" },
          ...matchingExperiences.map((exp) => ({
            text: `${exp.title} as ${exp.role}`,
            type: "result",
            color: exp.color || "#34d399", // Default color if not specified
          })),
        ];
      },
    },
    projects: {
      description: "List all projects I've worked on",
      action: () => {
        return [
          { text: "Notable Projects:", type: "system" },
          { text: "", type: "break" },
          { text: "Lisboa Participa", type: "result", color: "#34d399" },
          {
            text: "  A participation portal for Lisbon City Council",
            type: "system",
          },
          { text: "", type: "break" },
          { text: "OP Jovem", type: "result", color: "#34d399" },
          {
            text: "  Youth Participatory Budget platform for citizens aged 14-30",
            type: "system",
          },
          { text: "", type: "break" },
          { text: "POP Penha", type: "result", color: "#f472b6" },
          {
            text: "  Participatory budget platform for Penha de França Parish",
            type: "system",
          },
          { text: "", type: "break" },
          {
            text: "Type 'project [name]' for more details about a specific project",
            type: "system",
          },
        ];
      },
    },

    project: {
      description:
        "Show details about a specific project (usage: project 'Lisboa Participa')",
      action: (args) => {
        if (!args.length) {
          return [{ text: "Please specify a project name", type: "error" }];
        }

        const projectName = args.join(" ").toLowerCase();

        const projects = {
          "lisboa participa": {
            name: "Lisboa Participa",
            description: "Participation Portal of the Lisbon City Council.",
            technologies: ["Symfony", "VueJS", "MySQL", "Docker"],
            url: "https://lisboaparticipa.pt",
            year: "2023",
            color: "#34d399",
          },
          "op jovem": {
            name: "OP Jovem",
            description:
              "The Youth Participatory Budget (OP Jovem) is a democratic participation process in which citizens aged between 14 and 30 can take part by creating proposals and voting.",
            technologies: ["Symfony", "VueJS", "MySQL", "Docker"],
            url: "https://opjovem.gov.pt",
            year: "2023",
            color: "#34d399",
          },
          "pop penha": {
            name: "POP Penha",
            description:
              "The POP Penha allows active participation in the management of the Parish by submitting proposals and voting.",
            technologies: ["Symfony", "JavaScript", "MySQL"],
            url: "https://pop-penha.pt",
            year: "2022",
            color: "#f472b6",
          },
        };

        const project = projects[projectName];

        if (!project) {
          return [
            { text: `Project "${args.join(" ")}" not found.`, type: "error" },
            {
              text: "Available projects: Lisboa Participa, OP Jovem, POP Penha",
              type: "system",
            },
          ];
        }

        return [
          { text: project.name, type: "year", color: project.color },
          { text: project.description, type: "system" },
          { text: "", type: "break" },
          { text: `Year: ${project.year}`, type: "result" },
          {
            text: `Technologies: ${project.technologies.join(", ")}`,
            type: "result",
          },
          { text: `URL: ${project.url}`, type: "result", color: project.color },
        ];
      },
    },
    whoami: {
      description: "Show my description",
      action: () => {
        return [
          {
            text: `I am a passionate web developer with over 9 years of experience in creating scalable, high-performance web applications. My expertise
            spans across a wide range of technologies, including PHP,
            JavaScript, Laravel, Symfony, Vue.js, and MySQL, allowing me to
            contribute effectively to both front-end and back-end development.
            Throughout my career, I’ve worked in agile environments,
            collaborating closely with teams to deliver innovative solutions. I
            am driven by problem-solving, consistently seeking ways to optimize
            performance and enhance user experiences. My focus on writing clean,
            maintainable code is paired with a commitment to unit testing
            (PHPUnit), ensuring robust and reliable software. I have experience
            leading small development teams, guiding them in best practices, and
            fostering a culture of continuous improvement. Additionally, I am
            skilled in working with Docker, Git, Elasticsearch, and RabbitMQ,
            leveraging these tools to streamline workflows and improve
            application scalability and performance. In previous roles, I’ve had
            the opportunity to work on a variety of projects, from HR management
            platforms to cybersecurity solutions and data visualization tools.
            I’m always eager to learn new technologies and embrace challenges
            that push me to grow both professionally and personally. I am
            excited about the opportunity to collaborate with like-minded
            professionals and contribute to impactful, innovative projects that
            make a difference.`,
            type: "system",
          },
          { text: "", type: "break" },
        ];
      },
    },

    resume: {
      description: "Download my resume",
      action: () => {
        // You could trigger a download here in a real implementation
        return [
          { text: "Preparing resume for download...", type: "system" },
          { text: "", type: "break" },
          {
            text: "Resume available at: /resume.pdf",
            type: "result",
          },
          { text: "", type: "break" },
          {
            text: "You can also view my experience using the 'experiences' command",
            type: "system",
          },
        ];
      },
    },

    joke: {
      description: "Tell a programming joke",
      action: () => {
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs!",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
          "Why do Java developers wear glasses? Because they don't C#!",
          "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
          "Why was the JavaScript developer sad? Because he didn't know how to Object.create(happiness)!",
          "What's a programmer's favorite hangout place? The Foo Bar!",
          "Why did the developer go broke? Because he used up all his cache!",
          "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25!",
          "Why did the functions stop calling each other? They had too many arguments!",
          "What's a developer's favorite tea? Proper-tea!",
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        return [
          { text: "Programming Joke:", type: "system" },
          { text: "", type: "break" },
          { text: randomJoke, type: "result" },
        ];
      },
    },

    ascii: {
      description: "Display ASCII art",
      action: () => {
        return [
          { text: "ASCII Art:", type: "system" },
          { text: "", type: "break" },
          {
            text: "  _      _____  __  __             _        _           ",
            type: "result",
            color: "#34d399",
          },
          {
            text: " | |    |  __ \\|  \\/  |           | |      (_)          ",
            type: "result",
            color: "#34d399",
          },
          {
            text: " | |    | |__) | \\  / | ___  _ __ | |_ ___  _ _ __ ___  ",
            type: "result",
            color: "#34d399",
          },
          {
            text: " | |    |  ___/| |\\/| |/ _ \\| '_ \\| __/ _ \\| | '__/ _ \\ ",
            type: "result",
            color: "#34d399",
          },
          {
            text: " | |____| |    | |  | | (_) | | | | || (_) | | | | (_) |",
            type: "result",
            color: "#34d399",
          },
          {
            text: " |______|_|    |_|  |_|\\___/|_| |_|\\__\\___/|_|_|  \\___/ ",
            type: "result",
            color: "#34d399",
          },
          { text: "", type: "break" },
          { text: "Full Stack Developer", type: "result" },
        ];
      },
    },

    // Command to display role and description of a specific experience
    expdetails: {
      description:
        "Show details about a specific work experience (usage: expDetails Neobrain)",
      action: (args) => {
        if (!args.length) {
          return [
            {
              text: "Error: Please specify a company name (e.g., expDetails Neobrain)",
              type: "error",
            },
          ];
        }

        const searchTerm = args.join(" ").toLowerCase();

        // Find experience that matches the search term
        const experience = experiences.find(
          (exp) =>
            exp.title.toLowerCase().includes(searchTerm) ||
            exp.role.toLowerCase().includes(searchTerm)
        );

        if (!experience) {
          return [
            {
              text: `No experience found matching "${args.join(" ")}"`,
              type: "error",
            },
            {
              text: `Available experiences: ${experiences
                .map((e) => e.title)
                .join(", ")}`,
              type: "system",
            },
          ];
        }

        return [
          {
            text: `${experience.title} - ${experience.role}`,
            type: "year",
            color: experience.color || "#34d399",
          },
          { text: `Timeframe: ${experience.timeframe}`, type: "system" },
          { text: "", type: "break" },
          { text: experience.description, type: "result" },
        ];
      },
    },
    year: {
      description: "Show skills for a specific year (usage: year 2023)",
      action: (args) => {
        if (!args.length) {
          return [
            {
              text: "Error: Please specify a year (e.g., year 2023)",
              type: "error",
            },
          ];
        }

        const year = parseInt(args[0]);
        const exp = experiences.find((e) => e.year === year);

        if (!exp) {
          return [
            { text: `Error: No data found for year ${year}`, type: "error" },
          ];
        }

        return [
          { text: `Skills from ${year}:`, type: "system" },
          { text: "", type: "break" },
          ...exp.stacks.map((stack) => ({
            text: `- ${stack}`,
            type: "result",
            color: exp.color,
          })),
        ];
      },
    },
    timeline: {
      description: "Show full timeline of skills by year",
      action: () => {
        return [
          { text: "Experience Timeline:", type: "system" },
          { text: "", type: "break" },
          ...experiences.flatMap((exp) => [
            { text: `${exp.year}`, type: "year", color: exp.color },
            ...exp.stacks.map((stack) => ({
              text: `  └─ ${stack}`,
              type: "result",
              color: exp.color,
            })),
            { text: "", type: "break" },
          ]),
        ];
      },
    },
    find: {
      description: "Find when a specific skill was used (usage: find react)",
      action: (args) => {
        if (!args.length) {
          return [
            {
              text: "Error: Please specify a skill to find (e.g., find react)",
              type: "error",
            },
          ];
        }

        const skill = args[0].toLowerCase();
        const matchingExps = experiences.filter((exp) =>
          exp.stacks.some((s) => s.toLowerCase().includes(skill))
        );

        if (!matchingExps.length) {
          return [{ text: `No matches found for "${args[0]}"`, type: "error" }];
        }

        return [
          { text: `Years when "${args[0]}" was used:`, type: "system" },
          { text: "", type: "break" },
          ...matchingExps.map((exp) => ({
            text: `${exp.year}: ${exp.stacks
              .filter((s) => s.toLowerCase().includes(skill))
              .join(", ")}`,
            type: "result",
            color: exp.color,
          })),
        ];
      },
    },
    about: {
      description: "About this terminal",
      action: () => {
        return [
          { text: "Interactive Experience Terminal", type: "system" },
          { text: "Created by Luis Monteiro", type: "system" },
          {
            text: "This terminal showcases my technical experience timeline.",
            type: "system",
          },
          { text: "Built with React and Canvas animations.", type: "system" },
        ];
      },
    },
    automin: {
      description: "Toggle auto-minimize when scrolling (automin on/off)",
      action: (args) => {
        if (args.length && ["on", "off"].includes(args[0].toLowerCase())) {
          const newState = args[0].toLowerCase() === "on";
          onToggleAutoMinimize(newState);
          return [
            {
              text: `Auto-minimize ${newState ? "enabled" : "disabled"}`,
              type: "system",
            },
          ];
        }

        return [
          {
            text: `Auto-minimize is currently ${
              autoMinimize ? "enabled" : "disabled"
            }. Use "automin on" or "automin off" to change.`,
            type: "system",
          },
        ];
      },
    },

    pin: {
      description: "Pin the terminal (same as automin off)",
      action: () => {
        onToggleAutoMinimize(false);
        return [
          {
            text: "Terminal pinned. It will not auto-minimize when scrolling.",
            type: "system",
          },
        ];
      },
    },
  };

  // Blinking cursor effect
  React.useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when clicking anywhere in the terminal
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    if (terminalRef.current) {
      terminalRef.current.addEventListener("click", handleClick);
    }

    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener("click", handleClick);
      }
    };
  }, []);

  // Handle input submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add the command to output
    const newOutput = [...output, { text: `> ${input}`, type: "command" }];

    // Parse the command
    const [cmd, ...args] = input.trim().toLowerCase().split(" ");

    // Execute the command if it exists
    if (commands[cmd]) {
      const result = commands[cmd].action(args);
      setOutput([...newOutput, ...result, { text: "", type: "break" }]);
    } else {
      setOutput([
        ...newOutput,
        {
          text: `Command not found: ${cmd}. Type "help" to see available commands.`,
          type: "error",
        },
        { text: "", type: "break" },
      ]);
    }

    // Clear the input
    setInput("");
  };

  // Canvas animation for terminal background
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Characters to display
    const chars = "01";

    function draw() {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0"; // Green text
      ctx.font = "15px monospace";

      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars.charAt(Math.floor(Math.random() * chars.length));

        // x = i * 20, y = value of drops[i]
        ctx.fillText(text, i * 20, drops[i] * 20);

        // Sending the drop back to the top randomly after it has crossed the screen
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment y coordinate
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 relative pl-4">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-10 z-0 pl-4"
      />

      <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700 relative z-10">
        {/* Terminal header with minimize, close, and pin buttons */}
        <div className="bg-gray-800 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
              onClick={onClose}
              title="Close"
            ></div>
            <div
              className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer"
              onClick={onMinimize}
              title="Minimize"
            ></div>
            <div
              className={`w-3 h-3 ${
                autoMinimize ? "bg-green-500" : "bg-gray-500"
              } rounded-full cursor-pointer`}
              onClick={onToggleAutoMinimize}
              title={
                autoMinimize
                  ? "Auto-minimize enabled"
                  : "Auto-minimize disabled (pinned)"
              }
            ></div>
          </div>
          <div className="mx-auto text-gray-400 text-sm font-mono">
            experience-terminal — bash {autoMinimize ? "" : "(pinned)"}
          </div>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="bg-black bg-opacity-90 px-2 sm:px-4 py-4 h-96 overflow-y-auto font-mono text-sm"
        >
          {output.map((line, index) => (
            <div key={index} className="mb-1">
              {line.type === "break" ? (
                <div className="h-2"></div>
              ) : (
                <pre
                  className={`whitespace-pre-wrap ${
                    line.type === "command"
                      ? "text-white"
                      : line.type === "error"
                      ? "text-red-400"
                      : line.type === "year"
                      ? "font-bold"
                      : "text-gray-300"
                  }`}
                  style={{
                    color:
                      line.color ||
                      (line.type === "system" ? "#a0aec0" : undefined),
                  }}
                >
                  {line.text}
                </pre>
              )}
            </div>
          ))}

          {/* Current input line */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-green-400 mr-2">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-transparent outline-none text-white font-mono"
              autoFocus
            />
            <span
              className={`w-2 h-5 bg-white ${
                cursorVisible ? "opacity-100" : "opacity-0"
              } transition-opacity duration-100`}
            ></span>
          </form>
        </div>
      </div>
    </div>
  );
}
