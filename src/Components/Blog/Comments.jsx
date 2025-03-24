import React, { useState } from "react";
import { useComment } from "../../Context/CommentContext";
import { motion, AnimatePresence } from "framer-motion";

const Comments = ({ postId }) => {
  const { getPostComments, addComment, deleteComment, updateComment, loading } =
    useComment();
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const comments = getPostComments(postId);

  const user = sessionStorage.getItem("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!postId) {
      console.error("No post ID provided");
      return;
    }

    try {
      await addComment(postId, newComment.trim());
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (commentId) => {
    try {
      await updateComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Comments
      </h3>

      {/* Comment Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          rows="3"
        />
        <motion.button
          type="submit"
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Post Comment
        </motion.button>
      </motion.form>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-blue-400">
                    {comment.userEmail}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {user && user === comment.userEmail && (
                  <div className="space-x-3">
                    {editingComment === comment.id ? (
                      <motion.button
                        onClick={() => handleUpdate(comment.id)}
                        className="text-green-500 hover:text-green-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Save
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Edit
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                )}
              </div>
              {editingComment === comment.id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  rows="3"
                />
              ) : (
                <p className="text-gray-200 leading-relaxed">
                  {comment.content}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Comments;
