import React, { useState, useEffect, useCallback, useContext } from "react";
import { signInWithGoogle } from "../Firebase/signin";
import { ReviewsContext } from "../Context/ReviewsContext";
import { useIsInView } from "../Hooks/useIsInView";

export const Reviews = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    reviews,
    addReview,
    fetchData,
    hasMoreData,
    isLoading,
    totalReviews,
    averageRating,
    ratingDistribution,
  } = useContext(ReviewsContext);
  const [newReview, setNewReview] = useState("");
  const [star, setStar] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(-1);
  const [eleRef, isInView] = useIsInView();
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [filterValue, setFilterValue] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const stars = [1, 2, 3, 4, 5];

  // Memoize the Google sign-in function
  const onGoogleSignIn = useCallback(async () => {
    await signInWithGoogle()
      .then((response) => {
        setUser(response.user.email);
        setIsLoggedIn(true);
        sessionStorage.setItem("user", response.user.email);
        // Show the form after successful login
        setShowForm(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Memoize the sign-out function
  const signOut = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("user");
    setShowForm(false);
  }, []);

  // Memoize the star click handler
  const handleClickStar = useCallback((e) => {
    setStar(parseInt(e));
    setValidationError("");
  }, []);

  // Memoize the review submission handler
  const handleSubmitReview = useCallback(
    (e) => {
      e.preventDefault();

      // Validate review
      if (!newReview.trim()) {
        setValidationError("Please write a review before submitting");
        return;
      }

      if (star === 0) {
        setValidationError("Please select a rating");
        return;
      }

      // Clear validation error
      setValidationError("");

      const review = {
        id: Date.now(), // Use timestamp for unique ID
        name: user ?? "Anonymous",
        review: newReview,
        star,
        timestamp: Date.now(),
      };

      addReview(review);
      setNewReview("");
      setStar(0);

      // Hide form after submission
      setShowForm(false);

      const toast = document.createElement("div");
      toast.className = "success-toast";
      toast.textContent = "Your review has been submitted!";
      document.body.appendChild(toast);

      // Remove toast after animation completes
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 4000);
    },
    [newReview, user, star, addReview]
  );

  // Memoize the load more handler
  const handleLoadMore = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Filter reviews based on star rating
  const filteredReviews =
    filterValue > 0
      ? reviews.filter((review) => review.star === filterValue)
      : reviews;

  // Load user from sessionStorage on mount
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  // Memoize the initial load effect
  const initialLoadEffect = useCallback(() => {
    if (isInView && !initialLoadDone && !isLoading) {
      fetchData();
      setInitialLoadDone(true);
    }
  }, [isInView, initialLoadDone, isLoading, fetchData]);

  // Use the memoized effect
  useEffect(() => {
    initialLoadEffect();
  }, [initialLoadEffect]);

  const handleWriteReviewClick = () => {
    setShowForm(true);

    // Wait for form to become visible
    setTimeout(() => {
      const formElement = document.getElementById("review-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // CSS Animation styles
  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideInRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .review-card {
      animation: fadeIn 0.5s ease-in-out forwards;
    }
    
    .summary-card {
      animation: scaleIn 0.5s ease-out forwards;
    }
    
    .star-rating {
      animation: slideInRight 0.5s ease-out forwards;
    }
    
    .pulse-animation {
      animation: pulse 2s infinite;
    }
    
    .filter-button:hover {
      transform: translateY(-2px);
      transition: transform 0.2s ease;
    }
    
    .success-message {
      animation: fadeIn 1s ease-out forwards;
    }
    
    .form-container {
      transition: max-height 0.5s ease-out, opacity 0.3s ease-out, margin 0.5s ease-out;
      max-height: 0;
      opacity: 0;
      margin: 0;
      overflow: hidden;
    }
    
    .form-container.show {
      max-height: 500px;
      opacity: 1;
      margin: 1rem 0;
    }

    @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .review-card {
    opacity: 0;
    animation: slideInUp 0.5s ease-out forwards;
  }
    @keyframes starPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  .star-selected {
    animation: starPop 0.3s ease-out;
  }

  .review-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.form-container {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-out, opacity 0.3s ease-out, margin 0.5s ease-out;
}

.form-container.show {
  max-height: 600px; /* Adjust based on your form's height */
  opacity: 1;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

@keyframes slideInDown {
    from { 
      transform: translateY(-100%);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .success-toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1E40AF;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    z-index: 50;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 20px rgba(59, 130, 246, 0.3);
    animation: slideInDown 0.5s ease-out forwards, fadeOut 0.5s ease-in forwards 3s;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  .skeleton {
    background: linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
    border-radius: 0.5rem;
  }
  `;

  return (
    <section ref={eleRef} className=" h-min-screen" id="reviews">
      <style>{styles}</style>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-12 mt-16 md:mt-20">
        <div className="reviews max-w-4xl mx-auto">
          <div className="reviews-container mb-10">
            <h1 className="text-4xl font-bold mb-2 text-white">Reviews</h1>
            <div className="w-20 h-1 bg-blue-500 mb-8"></div>

            {/* Rating Summary Card */}
            <div className="summary-card bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-xl border border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h2 className="text-xl font-semibold text-white mb-3">
                    Overall Rating
                  </h2>
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="text-5xl font-bold text-yellow-400 mr-2">
                      {averageRating}
                    </span>
                    <span className="text-gray-400 text-xl">/ 5</span>
                  </div>
                  <p className="text-gray-400 mt-2">
                    Based on {totalReviews} reviews
                  </p>
                </div>
                <div className="star-rating flex items-center">
                  {stars.map((starLoop) => (
                    <svg
                      key={`summary-star-${starLoop}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      width="36px"
                      className="inline-block mx-1"
                    >
                      <path
                        fill={
                          starLoop <= Math.round(averageRating)
                            ? "#FFD43B"
                            : "#f5f5f5"
                        }
                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                      />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Rating distribution bars */}
              <div className="mt-8 space-y-2 px-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  // Get the count for this rating from the distribution
                  const count = ratingDistribution[rating] || 0;

                  // Calculate percentage based on total reviews
                  const percentage =
                    totalReviews > 0
                      ? Math.round((count / totalReviews) * 100)
                      : 0;

                  return (
                    <div
                      key={`distribution-${rating}`}
                      className="flex items-center"
                    >
                      <div className="w-12 text-right pr-4 text-gray-400">
                        {rating} ★
                      </div>
                      <div className="flex-grow bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-24 text-left pl-4 text-gray-400">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Message */}
            <div
              id="success-message"
              className="hidden success-message bg-green-600 text-white p-4 rounded-lg mb-6"
            >
              Thank you for your review! Your feedback helps others.
            </div>

            {/* User Authentication */}
            <div className="mb-6">
              {!isLoggedIn ? (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    Sign in to share your experience or continue as anonymous
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      onClick={onGoogleSignIn}
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#ffffff"
                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                          />
                        </svg>
                        Sign in with Google
                      </div>
                    </button>
                    <button
                      className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      onClick={() => setShowForm(true)}
                    >
                      Continue as Anonymous
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 shadow-md">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">
                        {user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user}</p>
                      <p className="text-gray-400 text-sm">Signed in</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                      onClick={() => setShowForm(!showForm)}
                    >
                      {showForm ? "Cancel" : "Write a Review"}
                    </button>
                    <button
                      className="bg-transparent hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-lg border border-gray-600 transition-colors duration-200"
                      onClick={signOut}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className={`form-container ${showForm ? "show" : ""}`}>
            <form
              id="review-form"
              onSubmit={handleSubmitReview}
              className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl border border-gray-700"
            >
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Share Your Experience
              </h2>
              <textarea
                className="w-full h-40 p-4 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 text-lg"
                placeholder="What did you like or dislike? What was your experience like?"
                value={newReview}
                onChange={(e) => {
                  setNewReview(e.target.value);
                  if (e.target.value.trim()) setValidationError("");
                }}
              />

              <div className="mt-6 mb-4">
                <p className="text-white mb-3 text-lg">Your Rating:</p>
                <div
                  className="flex flex-row gap-3 focus:outline-none"
                  role="radiogroup"
                  aria-label="Rating"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      setStar((prev) => Math.min(prev + 1, 5));
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      setStar((prev) => Math.max(prev - 1, 1));
                    } else if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      // If no star is selected, select the first one
                      if (star === 0) {
                        setStar(1);
                      }
                    }
                  }}
                >
                  {stars.map((starLoop) => (
                    <button
                      key={`rate-${starLoop}`}
                      type="button"
                      role="radio"
                      aria-checked={star === starLoop}
                      aria-label={`${starLoop} stars`}
                      onClick={() => handleClickStar(starLoop)}
                      onMouseEnter={() => setHoveredStar(starLoop)}
                      onMouseLeave={() => setHoveredStar(-1)}
                      className={`group hover:scale-110 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 p-1 rounded-full ${
                        star === starLoop ? "ring-2 ring-yellow-400" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        width="40px"
                        height="40px"
                        className={starLoop <= star ? "star-selected" : ""}
                      >
                        <path
                          style={{
                            fill:
                              hoveredStar >= starLoop
                                ? "#FFD700" // Gold for hovered stars
                                : starLoop <= star
                                ? "#FFD43B" // Yellow for selected stars
                                : "#4B5563", // Gray for unselected stars
                            transition: "fill 0.2s ease",
                          }}
                          className="group-hover:fill-yellow-300"
                          d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 mt-2">
                  {star === 0
                    ? "Select your rating"
                    : star === 1
                    ? "Poor - Not recommended"
                    : star === 2
                    ? "Fair - Below average"
                    : star === 3
                    ? "Good - Average experience"
                    : star === 4
                    ? "Very good - Recommended"
                    : "Excellent - Outstanding experience"}
                </p>
              </div>

              {validationError && (
                <div className="text-red-500 mb-4 p-3 bg-red-900 bg-opacity-30 rounded-lg">
                  <svg
                    className="w-5 h-5 inline-block mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {validationError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                  type="submit"
                >
                  Submit Review
                </button>
                <button
                  className="flex-1 p-3 bg-transparent hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200 font-semibold border border-gray-600"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewReview("");
                    setStar(0);
                    setValidationError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilterValue(0)}
              className={`filter-button px-4 py-2 rounded-full transition-all duration-200 ${
                filterValue === 0
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              All Reviews
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={`filter-${rating}`}
                onClick={() => setFilterValue(rating)}
                className={`filter-button px-4 py-2 rounded-full flex items-center transition-all duration-200 ${
                  filterValue === rating
                    ? "bg-white text-gray-900 shadow-md"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {rating} <span className="text-yellow-400 ml-1">★</span>
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="reviews-container">
            {filteredReviews.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
                <svg
                  className="w-16 h-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <p className="text-white text-xl font-medium">
                  {filterValue > 0
                    ? `No ${filterValue}-star reviews yet`
                    : "No reviews yet. Be the first to leave a review!"}
                </p>
                <button
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-200"
                  onClick={() => setShowForm(true)}
                >
                  Write a Review
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {filteredReviews.map((review, index) => (
                <div
                  key={`rated-${review.key || review.id}-${index}`}
                  className="review-card text-white border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex mb-4">
                        {stars.map((starLoop) => (
                          <svg
                            key={`star-${
                              review.key || review.id
                            }-${starLoop}-${index}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            width="20px"
                            className="inline-block mr-1"
                          >
                            <path
                              fill={
                                starLoop <= review.star ? "#FFD43B" : "#4B5563"
                              }
                              d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                            />
                          </svg>
                        ))}
                        {review.timestamp && (
                          <span className="ml-3 text-gray-400 text-sm">
                            {new Date(review.timestamp).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-lg mb-4 leading-relaxed">
                        {review.review}
                      </p>
                      <div className="flex items-center">
                        <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {review.name && review.name !== ""
                              ? review.name.charAt(0).toUpperCase()
                              : "A"}
                          </span>
                        </div>
                        <span className="font-medium text-gray-300">
                          {review.name !== "" ? review.name : "Anonymous"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreData &&
              !isLoading &&
              filteredReviews.length > 0 &&
              filterValue === 0 && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg border border-gray-700"
                  >
                    Load More Reviews
                  </button>
                </div>
              )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="space-y-6 mt-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700"
                  >
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div
                          key={`star-${j}`}
                          className="skeleton w-5 h-5 rounded-full mr-1"
                        ></div>
                      ))}
                    </div>
                    <div className="skeleton h-4 w-full mb-3"></div>
                    <div className="skeleton h-4 w-3/4 mb-3"></div>
                    <div className="skeleton h-4 w-1/2 mb-6"></div>
                    <div className="flex items-center">
                      <div className="skeleton w-8 h-8 rounded-full mr-3"></div>
                      <div className="skeleton h-3 w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
