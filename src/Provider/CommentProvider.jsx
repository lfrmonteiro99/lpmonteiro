import React, { useState, useEffect } from "react";
import { ref, push, onValue, remove, update } from "firebase/database";
import { database } from "../Firebase/firebase.conf";
import { CommentContext } from "../Context/CommentContext";

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
      let userEmail = localStorage.getItem("user");
      if (!userEmail) {
        userEmail = "Anonymous";
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

  // Get a single comment by ID
  const getCommentById = (commentId) => {
    return comments[commentId]
      ? { id: commentId, ...comments[commentId] }
      : null;
  };

  // Get comments for a specific post
  const getPostComments = (postId) => {
    if (!postId) return [];

    const postComments = Object.entries(comments)
      .filter(([, comment]) => comment.postId === postId)
      .map(([id, comment]) => ({
        id,
        ...comment,
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return postComments;
  };

  const value = {
    comments,
    loading,
    addComment,
    deleteComment,
    updateComment,
    getPostComments,
    getCommentById,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};
