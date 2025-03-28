import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../../Context/BlogContext";
import { useComment } from "../../Context/CommentContext";
import AddBlogPost from "./AddBlogPost";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogList() {
  const navigate = useNavigate();
  const {
    posts,
    loading,
    hasMoreData,
    searchTerm,
    selectedTag,
    allTags,
    setSearchTerm,
    setSelectedTag,
    loadMorePosts,
    isLoadingMore,
    hasPostsInDb,
    toggleLike,
    getLikeCount,
    hasUserLiked,
    handleLinkedInShare,
  } = useBlog();
  const { getPostComments } = useComment();
  const [linkedInContent, setLinkedInContent] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 10) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePostClick = (post) => {
    navigate(`/blog/${post.id}`);
  };

  const handleEditClick = (e, post) => {
    e.stopPropagation();
    navigate(`/blog/edit/${post.id}`);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreData) return;
    try {
      await loadMorePosts();
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
  };

  const isAuthorized = () => {
    const user = sessionStorage.getItem("user");
    return user === "lfrmonteiro99@gmail.com";
  };

  const handleLinkedInGenerate = async (post) => {
    try {
      const content = await handleLinkedInShare(post);

      if (content) {
        setLinkedInContent((prev) => ({
          ...prev,
          [post.id]: content,
        }));

        // Show success message
        alert(
          "LinkedIn content generated successfully! Click the LinkedIn icon to share."
        );
      } else {
        console.log("No content was generated!");
        throw new Error("No content generated");
      }
    } catch (error) {
      console.error("Error in handleLinkedInGenerate:", error);
      alert("Failed to generate LinkedIn content. Please try again.");
    }
  };

  const openLinkedInShare = (post) => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.origin + `/blog/${post.id}`
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=600");
  };

  if (loading && !posts.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasPostsInDb) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No blog posts found.</p>
      </div>
    );
  }

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-6">
        <AddBlogPost />

        <h2 className="text-4xl font-bold mb-8 text-white text-center">{`<Blog />`}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search bar */}
            {hasPostsInDb && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Popular Tags
                </h3>
                <div className="flex flex-col space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => handleTagClick(null)}
                    className={`w-full text-left px-2 py-1 text-sm transition-colors hover:text-blue-400 ${
                      selectedTag === null ? "text-blue-400" : "text-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`w-full text-left px-2 py-1 text-sm transition-colors hover:text-blue-400 ${
                        selectedTag === tag ? "text-blue-400" : "text-gray-300"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Blog Posts */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Post */}
            <AnimatePresence>
              {posts.length > 0 && (
                <motion.div
                  key={posts[0].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handlePostClick(posts[0])}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-[280px] h-48 md:h-[280px] relative overflow-hidden flex-shrink-0">
                      <img
                        src={
                          posts[0].image ||
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%232d3748'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%234a5568' font-family='Arial' font-size='24'%3ENo image available%3C/text%3E%3C/svg%3E"
                        }
                        alt={posts[0].title}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="flex-grow p-8 flex flex-col min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2">
                          {posts[0].title}
                        </h2>
                        {isAuthorized() && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLinkedInGenerate(posts[0]);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                              title="Generate LinkedIn Content"
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
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </button>
                            {linkedInContent[posts[0].id] && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLinkedInShare(posts[0]);
                                }}
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                title="Share on LinkedIn"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={(e) => handleEditClick(e, posts[0])}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                              title="Edit post"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400 mb-6 line-clamp-4">
                        {posts[0].summary}
                      </div>
                      <div className="mt-auto">
                        <div className="flex gap-2 overflow-x-auto pb-2 thin-scrollbar">
                          {posts[0].tags?.slice(0, 3).map((tag, index) => (
                            <span
                              key={`${posts[0].id}-tag-${index}`}
                              className="shrink-0 px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors border border-blue-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {posts[0].tags?.length > 3 && (
                            <span className="shrink-0 px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/20">
                              +{posts[0].tags.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-gray-400">
                          <span className="text-sm">
                            {formatDate(posts[0].createdAt)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(posts[0].id);
                              }}
                              className={`flex items-center gap-1 transition-colors ${
                                hasUserLiked(posts[0].id)
                                  ? "text-blue-400"
                                  : "text-gray-400 hover:text-blue-400"
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill={
                                  hasUserLiked(posts[0].id)
                                    ? "currentColor"
                                    : "none"
                                }
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
                              <span className="text-sm">
                                {getLikeCount(posts[0].id)}
                              </span>
                            </button>
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="text-sm">
                                {getPostComments(posts[0].id).length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Blog Posts Feed */}
            <motion.div
              className="space-y-6"
              layout="position"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <AnimatePresence>
                {posts.slice(1).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: index * 0.1,
                    }}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative flex flex-col md:flex-row"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="w-full md:w-[280px] h-48 md:h-[280px] flex-shrink-0">
                      <img
                        src={
                          post.image ||
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%232d3748'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%234a5568' font-family='Arial' font-size='24'%3ENo image available%3C/text%3E%3C/svg%3E"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow p-6 flex flex-col min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        {isAuthorized() && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLinkedInGenerate(post);
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                              title="Generate LinkedIn Content"
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
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </button>
                            {linkedInContent[post.id] && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLinkedInShare(post);
                                }}
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                title="Share on LinkedIn"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={(e) => handleEditClick(e, post)}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                              title="Edit post"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400 mb-4 line-clamp-4 flex-grow">
                        {post.summary}
                      </div>
                      <div className="mt-auto">
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {post.tags?.slice(0, 3).map((tag, index) => (
                            <span
                              key={`${post.id}-tag-${index}`}
                              className="shrink-0 px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors border border-blue-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags?.length > 3 && (
                            <span className="shrink-0 px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/20">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-gray-400">
                          <span className="text-sm">
                            {formatDate(post.createdAt)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(post.id);
                              }}
                              className={`flex items-center gap-1 transition-colors ${
                                hasUserLiked(post.id)
                                  ? "text-blue-400"
                                  : "text-gray-400 hover:text-blue-400"
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill={
                                  hasUserLiked(post.id)
                                    ? "currentColor"
                                    : "none"
                                }
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
                              <span className="text-sm">
                                {getLikeCount(post.id)}
                              </span>
                            </button>
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="text-sm">
                                {getPostComments(post.id).length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            <AnimatePresence>
              {hasMoreData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                    }}
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="group relative px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <motion.span
                      animate={isLoadingMore ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {isLoadingMore ? "Loading..." : "Load More"}
                    </motion.span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
