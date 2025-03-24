import React from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../../Context/BlogContext";

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
  } = useBlog();

  const handlePostClick = (post) => {
    console.log("Clicking post with ID:", post.id);
    navigate(`/blog/${post.id}`);
  };

  const handleTagClick = (tag) => {
    console.log("Tag clicked in BlogList:", tag);
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-white">Blog</h2>

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
              <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
                <button
                  onClick={() => handleTagClick(null)}
                  className={`w-full text-left px-2 py-1 text-sm transition-colors hover:text-blue-400 ${
                    selectedTag === null ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  All
                </button>
                <div className="md:hidden">
                  {allTags.slice(0, 3).map((tag) => (
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
                <div className="hidden md:block">
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
            </div>
          )}
        </div>

        {/* Right Column - Blog Posts */}
        <div className="lg:col-span-3 space-y-8">
          {/* Featured Post */}
          {posts.length > 0 && (
            <div
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handlePostClick(posts[0])}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full overflow-hidden">
                  <img
                    src={
                      posts[0].image ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%232d3748'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%234a5568' font-family='Arial' font-size='24'%3ENo image available%3C/text%3E%3C/svg%3E"
                    }
                    alt={posts[0].title}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2">
                    {posts[0].title}
                  </h2>
                  <div
                    className="text-gray-400 mb-6 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: posts[0].content }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {posts[0].tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={`${posts[0].id}-tag-${index}`}
                        className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Posts Feed */}
          <div className="space-y-6">
            {posts.slice(1).map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-[200px] relative"
                onClick={() => handlePostClick(post)}
              >
                <div className="absolute left-0 top-0 w-48 h-[200px]">
                  <img
                    src={
                      post.image ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%232d3748'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%234a5568' font-family='Arial' font-size='24'%3ENo image available%3C/text%3E%3C/svg%3E"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-6 p-6 h-full pl-56">
                  <div className="flex-grow flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <div
                      className="text-gray-400 mb-4 line-clamp-4 flex-grow"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags?.slice(0, 2).map((tag, index) => (
                        <span
                          key={`${post.id}-tag-${index}`}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags?.length > 2 && (
                        <span
                          key={`${post.id}-more-tags`}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                        >
                          +{post.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreData && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
