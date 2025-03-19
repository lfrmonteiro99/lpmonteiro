import React from "react";

export default function BannerPhraseSwapper() {
  const [phrase, setPhrase] = React.useState(""); // Current displayed phrase
  const [currentIndex, setCurrentIndex] = React.useState(0); // Index of the current phrase
  const [isTyping, setIsTyping] = React.useState(true); // Track if typing or erasing

  const phrases = React.useMemo(
    () => [
      "Luís Monteiro",
      "From Portugal",
      "The Web Developer",
      "The Programmer",
      "The Backend Developer",
      "The Frontend Developer",
      "The Full Stack Developer",
      "The Free-Lancer",
    ],
    []
  );
  React.useEffect(() => {
    let interval;

    if (isTyping) {
      // Typing effect: Add letters one by one
      if (phrase.length < phrases[currentIndex].length) {
        interval = setInterval(() => {
          setPhrase(
            (prevPhrase) =>
              prevPhrase + phrases[currentIndex][prevPhrase.length]
          );
        }, 100); // Adjust typing speed here
      } else {
        // When typing is complete, switch to erasing after a delay
        setTimeout(() => setIsTyping(false), 1000); // 1-second delay before erasing
      }
    } else {
      // Erasing effect: Remove letters one by one
      if (phrase.length > 0) {
        interval = setInterval(() => {
          setPhrase((prevPhrase) => prevPhrase.slice(0, -1)); // Remove last character
        }, 50); // Adjust erasing speed here
      } else {
        // When erasing is complete, move to the next phrase
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsTyping(true); // Switch back to typing
      }
    }

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(interval);
  }, [phrase, isTyping, currentIndex, phrases]);

  return (
    <>
      <p className="text-5xl flex justify-center mb-4 ">
        <span className="text-white">Hello, I'm</span>
      </p>
      <span style={{ opacity: 1, transform: "none" }}>
        <div className="overflow-hidden py-4 min-h-[90px]">
          <h1 className="text-white text-4xl lg:leading-base ease-in-out delay-1000 transition-opacity sm:text-5xl lg:text-8xl font-extrabold transition-all">
            {phrase}
            <span className="animate-ping duration-100">|</span>
          </h1>
        </div>
      </span>
    </>
  );
}
