import React from "react";
import Banner from "./Components/Banner";
import "./index.css";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import Skills from "./Components/Skills";
import Footer from "./Components/Footer";
import Projects from "./Components/Projects";
import Experience from "./Components/Experience";
import { TerminalProvider } from "./Context/TerminalContext";
import TerminalButton from "./Components/TerminalButton";
import BackToTop from "./Components/BackToTop";
import { Reviews } from "./Components/Reviews";
import ReviewsProvider from "./Provider/ReviewsProvider";
import ContactMe from "./Components/ContactMe";

export default function App() {
  const [scrollPosition, setScrollPosition] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <TerminalProvider>
      <ReviewsProvider>
        {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}

        <div className="w-full bg-[rgb(22 24 22/1)] scroll-smooth">
          <header>
            <div className="w-full">
              <Navbar scrollPosition={scrollPosition} />
            </div>
          </header>
          <main className="pt-16 md:pt-24">
            <Banner />
            <About scrollPosition={scrollPosition} />
            <Projects scrollPosition={scrollPosition} />
            <Skills />
            <Experience />
            <Reviews />
            <ContactMe />
          </main>
          <section className=""></section>
          <Footer />
          <BackToTop />
          <TerminalButton />
        </div>
      </ReviewsProvider>
    </TerminalProvider>
  );
}
