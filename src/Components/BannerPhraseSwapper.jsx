import React from "react";

export default function BannerPhraseSwapper() {
    

    const [phrase, setPhrase] =React. useState("Luís Monteiro");

    React.useEffect(() => {


        const functions = [
        "Luís Monteiro",
        "From Portugal",
        "The Web Developer",
        "The Programmer",
        "The Backend Developer",
        "The Frontend Developer",
        "The Full Stack Developer",
        "The Free-Lancer"
    ];
        const timer = setTimeout(() => {
             const currentIndex = functions.indexOf(phrase);
            const nextPhrase = functions[(currentIndex + 1) % functions.length];

            setPhrase(nextPhrase);
        return () => clearTimeout(timer);
            
        }, 1000)
    });

    return (
        <>
        <p className="md:text-5xl flex justify-center mb-4 ">
            <span className="bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-transparent">Hello, I'm</span>
            </p>
        <span style={{ opacity: 1, transform: "none" }}>
        <div className="overflow-hidden py-4 min-h-[90px]">
        <h1 className="text-white text-4xl lg:leading-base ease-in-out delay-1000 transition-opacity sm:text-5xl lg:text-8xl font-extrabold transition-all animate-bounce">{phrase}</h1>
        </div>
        </span>
        
        </>
    );
}