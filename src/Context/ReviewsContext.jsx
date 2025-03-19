import { createContext, useState } from "react";
export const ReviewsContext = createContext({
  reviews: [],
  addReview: () => {},
  fetchData: () => {},
});
