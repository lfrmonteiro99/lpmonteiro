import React, { useState, useEffect, useCallback } from "react";
import { ReviewsContext } from "../Context/ReviewsContext";
import {
  ref,
  onValue,
  set,
  get,
  push,
  limitToFirst,
  orderByKey,
  orderByChild,
  startAt,
  query,
  endBefore,
  limitToLast,
} from "firebase/database";
import { db } from "../Firebase/firebase.conf";

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [oldestTimestamp, setOldestTimestamp] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const limit = 2; // Number of items to fetch per page

  // Fetch review statistics (total count, average rating, distribution)
  const fetchReviewStats = useCallback(async () => {
    try {
      // Get all reviews for statistics (we only need the star ratings)
      const statsQuery = query(ref(db, "reviews"));
      const snapshot = await get(statsQuery);
      const data = snapshot.val();

      if (data) {
        const reviewsArray = Object.values(data);
        const totalCount = reviewsArray.length;

        // Calculate average rating
        const sum = reviewsArray.reduce(
          (acc, review) => acc + (review.star || 0),
          0
        );
        const avg = totalCount > 0 ? (sum / totalCount).toFixed(1) : 0;

        // Calculate distribution
        const distribution = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };

        reviewsArray.forEach((review) => {
          if (review.star >= 1 && review.star <= 5) {
            distribution[review.star]++;
          }
        });

        // Update state
        setTotalReviews(totalCount);
        setAverageRating(avg);
        setRatingDistribution(distribution);
      } else {
        // No reviews yet
        setTotalReviews(0);
        setAverageRating(0);
        setRatingDistribution({
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching review statistics:", error);
    }
  }, []);

  // Initial load of statistics
  useEffect(() => {
    fetchReviewStats();
  }, [fetchReviewStats]);

  // Fetch reviews from Firebase
  const fetchData = useCallback(async () => {
    if (isLoading || !hasMoreData) {
      return;
    }

    setIsLoading(true);

    let queryRef;

    try {
      if (oldestTimestamp) {
        // If we have an oldest timestamp, get reviews older than that
        queryRef = query(
          ref(db, "reviews"),
          orderByChild("timestamp"),
          endBefore(oldestTimestamp),
          limitToLast(limit)
        );
      } else {
        // First load - get newest reviews
        queryRef = query(
          ref(db, "reviews"),
          orderByChild("timestamp"),
          limitToLast(limit)
        );
      }

      const snapshot = await get(queryRef);
      const data = snapshot.val();

      if (data) {
        // Convert to array
        let entries = Object.entries(data);

        // If we got fewer items than the limit, there are no more to fetch
        if (entries.length < limit) {
          setHasMoreData(false);
        }

        // Sort by timestamp in descending order (newest first)
        entries.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));

        if (entries.length > 0) {
          // Find the oldest timestamp in this batch
          let oldest = Infinity;
          entries.forEach(([_, value]) => {
            if (value.timestamp && value.timestamp < oldest) {
              oldest = value.timestamp;
            }
          });

          // Update oldest timestamp for next pagination
          if (oldest !== Infinity) {
            setOldestTimestamp(oldest);
          }

          // Convert to array of review objects with keys
          const newReviews = entries.map(([key, value]) => ({
            key,
            id: value.id || key,
            name: value.name || "Anonymous",
            review: value.review || "",
            star: value.star || 0,
            timestamp: value.timestamp || 0,
          }));

          // Update reviews state, ensuring no duplicates
          setReviews((prevReviews) => {
            // Create a Set of existing keys for O(1) lookup
            const existingKeys = new Set(prevReviews.map((r) => r.key));

            // Only add reviews with keys that don't already exist
            const uniqueNewReviews = newReviews.filter(
              (r) => !existingKeys.has(r.key)
            );

            // If we didn't add any new reviews, there are no more to fetch
            if (uniqueNewReviews.length === 0) {
              setHasMoreData(false);
            }

            // Combine and sort by timestamp (newest first)
            const updatedReviews = [...prevReviews, ...uniqueNewReviews].sort(
              (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
            );

            return updatedReviews;
          });
        } else {
          // No entries found in this batch
          setHasMoreData(false);
        }
      } else {
        // No data found
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasMoreData(false); // Prevent further attempts if there's an error
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMoreData, oldestTimestamp, limit]);

  // Add a new review
  const addReview = useCallback(
    async (review) => {
      // Optimistically update the UI
      setReviews((prevReviews) => [review, ...prevReviews]);

      // Update the database
      const reviewsRef = ref(db, "reviews");
      const newReviewRef = push(reviewsRef);

      const reviewWithTimestamp = {
        ...review,
        timestamp: Date.now(),
        id: newReviewRef.key,
      };

      await set(newReviewRef, reviewWithTimestamp)
        .then(() => {
          // Update statistics after adding a review
          fetchReviewStats();
        })
        .catch((err) => {
          console.log("Error adding review:", err);
          // Revert optimistic update if there's an error
          setReviews((prevReviews) =>
            prevReviews.filter((r) => r.id !== review.id)
          );
        });

      return reviewWithTimestamp;
    },
    [fetchReviewStats]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        fetchData,
        hasMoreData,
        isLoading,
        totalReviews,
        averageRating,
        ratingDistribution,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}
