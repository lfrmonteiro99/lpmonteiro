import React, { createContext, useContext, useState, useEffect } from "react";
import { ref, push, onValue, remove, update } from "firebase/database";
import { database } from "../Firebase/firebase.conf";

const CommentContext = createContext();

export const useComment = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
};

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  // Subscribe to comments for a specific post
  useEffect(() => {
    const commentsRef = ref(database, "comments");
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      setComments(data || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Add a new comment
  const addComment = async (postId, content) => {
    try {
      const userEmail = localStorage.getItem("user");
      if (!userEmail) {
        throw new Error("User not authenticated");
      }

      const newComment = {
        content,
        userEmail,
        createdAt: new Date().toISOString(),
        postId,
      };

      const commentsRef = ref(database, "comments");
      await push(commentsRef, newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    try {
      const commentRef = ref(database, `comments/${commentId}`);
      await remove(commentRef);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  // Update a comment
  const updateComment = async (commentId, content) => {
    try {
      const commentRef = ref(database, `comments/${commentId}`);
      await update(commentRef, { content });
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  };

  // Get comments for a specific post
  const getPostComments = (postId) => {
    return Object.entries(comments)
      .filter(([_, comment]) => comment.postId === postId)
      .map(([id, comment]) => ({
        id,
        ...comment,
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const value = {
    comments,
    loading,
    addComment,
    deleteComment,
    updateComment,
    getPostComments,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export { CommentContext };
