import React, { useState, useRef, useEffect } from "react";
import { useIsInView } from "../Hooks/useIsInView";
import emailjs from "@emailjs/browser";

export const ContactMe = () => {
  const [eleRef, isInView] = useIsInView();
  const formRef = useRef();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [animateForm, setAnimateForm] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  // Animate form elements when in view
  useEffect(() => {
    if (isInView) {
      setAnimateForm(true);
    }
  }, [isInView]);

  const validateForm = () => {
    const newErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Replace with your EmailJS service ID, template ID, and public key
      const result = await emailjs.sendForm(
        "service_zi3iwqm",
        "template_kbpewqz",
        formRef.current,
        "B7qRxyAvcikaS63eN"
      );

      setSubmitStatus("success");

      // Reset form
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSS Animation styles
  const styles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    
    .contact-title {
      opacity: 0;
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .contact-subtitle {
      opacity: 0;
      animation: fadeInUp 0.8s ease-out 0.2s forwards;
    }
    
    .contact-divider {
      width: 0;
      animation: slideInRight 0.8s ease-out 0.3s forwards;
    }
    
    .contact-info {
      opacity: 0;
      animation: fadeIn 0.8s ease-out 0.4s forwards;
    }
    
    .contact-form {
      opacity: 0;
      animation: fadeIn 0.8s ease-out 0.6s forwards;
    }
    
    .form-animate {
      opacity: 0;
      transform: translateY(10px);
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .submit-button:hover {
      animation: pulse 1.5s infinite;
    }
    
    .success-message {
      animation: fadeIn 0.5s ease-out;
    }
    
    .error-message {
      animation: fadeIn 0.5s ease-out;
    }

    .contact-title {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .contact-subtitle {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out 0.1s forwards;
  }
  
  .contact-form {
    opacity: 0;
    animation: fadeIn 0.6s ease-out 0.2s forwards;
  }

  .floating-label {
    position: relative;
  }
  
  .floating-label input,
  .floating-label textarea {
    height: 56px;
    padding-top: 20px;
    padding-bottom: 8px;
  }
  
  .floating-label textarea {
    height: auto;
    min-height: 120px;
  }
  
  .floating-label label {
    position: absolute;
    top: 0;
    left: 16px;
    height: 100%;
    display: flex;
    align-items: center;
    transform-origin: 0 0;
    transition: all 0.2s ease;
    color: #9CA3AF;
  }
  
  .floating-label input:focus + label,
  .floating-label textarea:focus + label,
  .floating-label input:not(:placeholder-shown) + label,
  .floating-label textarea:not(:placeholder-shown) + label {
    transform: translateY(-10px) scale(0.8);
    color: #3B82F6;
  }

  .hover-card {
    transition: all 0.3s ease;
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  
  .hover-card:hover {
    transform: translateY(-5px) rotateX(5deg) rotateY(5deg);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  }
  
  .hover-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  .hover-card:hover::after {
    opacity: 1;
  }
  `;

  return (
    <section
      ref={(el) => {
        eleRef.current = el;
        sectionRef.current = el;
      }}
      className="min-h-screen py-20 relative overflow-hidden"
      id="contact"
    >
      <style>{styles}</style>
      <div
        className="absolute pointer-events-none opacity-20 bg-blue-500 blur-[100px]"
        style={{
          width: "30vw",
          height: "30vw",
          borderRadius: "25%",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.5s ease-out, top 0.5s ease-out",
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 relative">
            <h2 className="contact-title text-4xl md:text-5xl font-bold text-white mb-4">
              Get In Touch
            </h2>
            <p className="contact-subtitle text-gray-400 text-lg max-w-2xl mx-auto">
              Have a question or want to work together? Feel free to reach out
              and I'll get back to you as soon as possible.
            </p>
            <div className="contact-divider w-24 h-1 bg-blue-500 mx-auto mt-8"></div>
            <div className="absolute -right-2 bottom-0 transform rotate-18 hidden md:block">
              <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-400 opacity-70"
              >
                <path
                  d="M6.5,27.5 C32.5,14.5 89.5,7.5 113.5,42.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                />
                <path
                  d="M108.5,32.5 L114.5,43.5 L103.5,47.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Contact Information */}
            <div className="contact-info md:col-span-1">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700 h-full relative">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="bg-blue-600 rounded-full p-3 mr-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm">Email</h4>
                      <a
                        href="mailto:your.email@example.com"
                        className="text-white hover:text-blue-400 transition-colors duration-300"
                      >
                        lfrmonteiro99@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start">
                    <div className="bg-blue-600 rounded-full p-3 mr-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm">Location</h4>
                      <p className="text-white">Coimbra, Portugal</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h4 className="text-gray-400 text-sm mb-3">
                      Connect with me
                    </h4>
                    <div className="flex space-x-4">
                      {/* LinkedIn */}
                      <a
                        href="https://www.linkedin.com/in/luís-monteiro-86457570"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-blue-600 text-white p-3 rounded-full transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>

                      {/* GitHub */}
                      <a
                        href="https://github.com/lfrmonteiro99"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-900 text-white p-3 rounded-full transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Availability Indicator */}
                <div className="mt-10 pt-6 border-t border-gray-700">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 animate-ping opacity-75"></div>
                    </div>
                    <p className="ml-3 text-white">
                      Currently available for new projects
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form md:col-span-2">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl border border-gray-700">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Send Me a Message
                </h3>

                {submitStatus === "success" && (
                  <div className="success-message mb-6 bg-green-900 bg-opacity-50 border border-green-500 text-green-200 px-4 py-3 rounded-lg flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      Your message has been sent successfully! I'll get back to
                      you soon.
                    </span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="error-message mb-6 bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>
                      There was an error sending your message. Please try again
                      later.
                    </span>
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div
                      className={`form-animate ${
                        animateForm ? "opacity-100" : ""
                      }`}
                      style={{ animationDelay: "0.1s" }}
                    >
                      <div className="floating-label">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder=" "
                          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div
                      className={`form-animate ${
                        animateForm ? "opacity-100" : ""
                      }`}
                      style={{ animationDelay: "0.2s" }}
                    >
                      <div className="floating-label">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder=" "
                          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        />
                        <label htmlFor="name">Your Email</label>
                      </div>

                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div
                    className={`form-animate mt-6 ${
                      animateForm ? "opacity-100" : ""
                    }`}
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="floating-label">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.nsubjectame}
                        onChange={handleChange}
                        placeholder=" "
                        className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      />
                      <label htmlFor="name">Subject</label>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div
                    className={`form-animate mt-6 ${
                      animateForm ? "opacity-100" : ""
                    }`}
                    style={{ animationDelay: "0.4s" }}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg border ${
                        errors.message ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none`}
                      placeholder="Hello, I'd like to talk about..."
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div
                    className={`form-animate mt-8 ${
                      animateForm ? "opacity-100" : ""
                    }`}
                    style={{ animationDelay: "0.5s" }}
                  >
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-button w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                          Send Message
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
