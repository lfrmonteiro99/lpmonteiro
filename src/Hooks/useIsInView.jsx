import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to detect if an element is in the viewport
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Percentage of element that needs to be visible (0-1)
 * @param {number} options.rootMargin - Margin around the root element
 * @returns {[React.RefObject, boolean]} - Ref to attach to element and boolean indicating if in view
 */
export const useIsInView = (options = {}) => {
  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  const { threshold = 0, rootMargin = "0px" } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if IntersectionObserver is available (modern browsers)
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(element);

      return () => {
        observer.unobserve(element);
        observer.disconnect();
      };
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      const checkInView = () => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        setIsInView(rect.top < window.innerHeight && rect.bottom >= 0);
      };

      checkInView(); // Check initially
      window.addEventListener("scroll", checkInView);
      window.addEventListener("resize", checkInView);

      return () => {
        window.removeEventListener("scroll", checkInView);
        window.removeEventListener("resize", checkInView);
      };
    }
  }, [threshold, rootMargin]);

  return [elementRef, isInView];
};
