import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Banner from "./Components/Banner";
import About from "./Components/About";
import BlogList from "./Components/Blog/BlogList";
import Projects from "./Components/Projects";
import Skills from "./Components/Skills";
import Experience from "./Components/Experience";
import { Reviews } from "./Components/Reviews";
import ContactMe from "./Components/ContactMe";
import Footer from "./Components/Footer";
import BackToTop from "./Components/BackToTop";
import TerminalButton from "./Components/TerminalButton";
import BlogPostPage from "./Components/Blog/BlogPostPage";
import { BlogProvider } from "./Provider/BlogProvider";
import { ReviewsProvider } from "./Provider/ReviewsProvider";
import { TerminalProvider } from "./Context/TerminalContext";
import { CommentProvider } from "./Provider/CommentProvider";

// Main layout component that includes all sections except blog post pages
const MainLayout = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <Banner />
      <About />
      <BlogList />
      <Projects />
      <Skills />
      <Experience />
      <Reviews />
      <ContactMe />
      <Footer />
      <BackToTop />
      <TerminalButton />
    </>
  );
};

// Wrapper component to handle scroll behavior
const ScrollToTop = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're returning from a blog post
    if (location.state?.scrollToBlog) {
      // Wait for the component to mount
      setTimeout(() => {
        const blogSection = document.getElementById("blog");
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      // Clear the state after scrolling
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return children;
};

function App() {
  return (
    <Router>
      <TerminalProvider>
        <ReviewsProvider>
          <BlogProvider>
            <CommentProvider>
              <ScrollToTop>
                <div className="min-h-screen bg-[rgb(22 24 22/1)] flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<MainLayout />} />
                      <Route path="/blog/:postId" element={<BlogPostPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ScrollToTop>
            </CommentProvider>
          </BlogProvider>
        </ReviewsProvider>
      </TerminalProvider>
    </Router>
  );
}

export default App;
