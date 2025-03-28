import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../../Context/BlogContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import BackToTop from "../BackToTop";
import TerminalButton from "../TerminalButton";
import { motion } from "framer-motion";
import Comments from "./Comments";

const BlogPostSkeleton = () => {
  return (
    <div className="min-h-screen bg-[rgb(22 24 22/1)] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button skeleton */}
          <div className="mb-6">
            <div className="w-24 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-12 w-3/4 bg-gray-800 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 w-1/4 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Comments section skeleton */}
          <div className="mt-12">
            <div className="h-8 w-32 bg-gray-800 rounded-lg animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="space-x-3">
                      <div className="h-6 w-12 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById, loading, toggleLike, getLikeCount, hasUserLiked } =
    useBlog();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  // Check if user is author
  useEffect(() => {
    const userEmail = sessionStorage.getItem("user");
    setIsAuthor(userEmail === "lfrmonteiro99@gmail.com");
  }, []);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Get ID from URL if not available in params
        const postId = id || window.location.pathname.split("/").pop();

        if (!postId) {
          console.error("No post ID provided in URL");
          return;
        }

        const postData = await getPostById(postId);
        if (postData) {
          setPost(postData);
        } else {
          console.error("Post not found");
          navigate("/blog");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/blog");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, getPostById, navigate]);

  // Ensure page starts at top when loading a blog post
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const handleBack = () => {
    // Navigate to the main page and scroll to the blog section
    navigate("/", {
      state: { scrollToBlog: true },
      replace: false,
    });
  };

  const handleEdit = () => {
    navigate(`/blog/edit/${post.id}`);
  };

  if (loading || isLoading) {
    return <BlogPostSkeleton />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[rgb(22 24 22/1)] flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Post not found
            </h2>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Blog
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(22 24 22/1)] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 text-blue-400 hover:text-blue-300 flex items-center"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </button>

          {/* Cover Image */}
          {post.image && (
            <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => toggleLike(post.id)}
                className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-all backdrop-blur-sm cursor-pointer hover:scale-105 ${
                  hasUserLiked(post.id)
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                    : "bg-gray-900/50 text-gray-400 hover:bg-gray-800/80 border border-gray-700/50 hover:text-gray-300"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={hasUserLiked(post.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="font-medium">{getLikeCount(post.id)}</span>
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold text-white">{post.title}</h1>
              {isAuthor && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Post
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
              <div
                className="text-gray-300 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* LinkedIn Content Section - Only visible to author */}
          {isAuthor && post.linkedInContent && (
            <div className="mt-8 bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  LinkedIn Content
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(post.linkedInContent);
                      alert("LinkedIn content copied to clipboard!");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Copy Content
                  </button>
                  <button
                    onClick={() => {
                      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        window.location.origin + `/blog/${post.id}`
                      )}`;
                      window.open(shareUrl, "_blank", "width=600,height=600");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.018-2.013-1.225-2.013-1.225 0-1.412 1.057-1.412 2.047v5.57h-3v-11h3v1.53h.045c.435-.823 1.5-1.694 3.088-1.694 3.3 0 3.862 2.17 3.862 4.995v6.169z" />
                    </svg>
                    Share on LinkedIn
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">
                  {post.linkedInContent}
                </pre>
              </div>
            </div>
          )}

          {/* Comments */}
          <Comments postId={post.id} />
        </motion.div>
      </main>
      <BackToTop />
      <TerminalButton />
    </div>
  );
};

export default BlogPostPage;
