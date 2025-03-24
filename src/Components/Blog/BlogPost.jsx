import React from "react";
import DOMPurify from "dompurify";

export default function BlogPost({ post, onClose }) {
  // Add a check to handle undefined post
  if (!post) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Post not found</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-gray-300 mt-4">
          The requested post could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{post.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          {new Date(post.date).toLocaleDateString()}
        </p>

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-8 pt-4 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            {post.tags &&
              post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-900 text-blue-100 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
