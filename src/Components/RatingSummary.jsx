const RatingSummary = ({ reviews }) => {
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.star, 0);
    return (sum / reviews.length).toFixed(1);
  };
  // Add this to the JSX
  return (
    <div className="rating-summary bg-gray-800 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Average Rating</h3>
          <div className="text-3xl font-bold text-yellow-400">
            {calculateAverageRating()}/5
          </div>
          <p className="text-gray-400">Based on {reviews.length} reviews</p>
        </div>
        <div className="text-5xl text-yellow-400">★</div>
      </div>
    </div>
  );
};

export default RatingSummary;
