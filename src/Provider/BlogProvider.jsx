import React, { useState, useEffect } from "react";
import {
  ref,
  onValue,
  push,
  set,
  remove,
  update,
  query,
  orderByChild,
  limitToLast,
  endBefore,
  get,
} from "firebase/database";
import { database } from "../Firebase/firebase.conf";
import { BlogContext } from "../Context/BlogContext";

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [hasPostsInDb, setHasPostsInDb] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [lastLoadedTimestamp, setLastLoadedTimestamp] = useState(null);
  const [allPosts, setAllPosts] = useState({}); // Store all posts by ID
  const [likes, setLikes] = useState({}); // Store likes for each post

  const postsPerPage = 9;

  // Fetch all posts for direct access
  useEffect(() => {
    const postsRef = ref(database, "blogPosts");
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAllPosts(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch likes for all posts
  useEffect(() => {
    const likesRef = ref(database, "likes");
    const unsubscribe = onValue(likesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLikes(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts with pagination
  const fetchPosts = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const postsRef = ref(database, "blogPosts");
      let q = query(
        postsRef,
        orderByChild("timestamp"),
        limitToLast(postsPerPage)
      );

      // If loading more posts, use the last loaded timestamp
      if (isLoadMore && lastLoadedTimestamp) {
        q = query(
          postsRef,
          orderByChild("timestamp"),
          endBefore(lastLoadedTimestamp),
          limitToLast(postsPerPage)
        );
      }

      const snapshot = await onValue(q, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const postsArray = Object.entries(data)
            .map(([id, post]) => ({
              id,
              ...post,
            }))
            .sort((a, b) => b.timestamp - a.timestamp);

          // Update last loaded timestamp for pagination
          if (postsArray.length > 0) {
            setLastLoadedTimestamp(postsArray[postsArray.length - 1].timestamp);
          }

          // If loading more, append to existing posts
          if (isLoadMore) {
            setPosts((prev) => [...prev, ...postsArray]);
          } else {
            setPosts(postsArray);
          }

          setHasPostsInDb(true);
          setHasMoreData(postsArray.length === postsPerPage);

          // Extract unique tags from all posts
          const tags = new Set();
          postsArray.forEach((post) => {
            if (post.tags && Array.isArray(post.tags)) {
              post.tags.forEach((tag) => {
                if (tag && typeof tag === "string") {
                  tags.add(tag);
                }
              });
            }
          });
          setAllTags(Array.from(tags));
        } else {
          console.log("No data received from Firebase");
          setHasPostsInDb(false);
          setAllTags([]);
          if (isLoadMore) {
            setHasMoreData(false);
          }
        }
        setLoading(false);
      });

      return () => snapshot();
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
      throw error;
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Load more posts
  const loadMorePosts = async () => {
    if (loading || !hasMoreData) return;
    await fetchPosts(true);
    setCurrentPage((prev) => prev + 1);
  };

  // Filter posts based on search term and selected tag
  const getFilteredPosts = () => {
    if (!posts.length) return [];

    const searchTermLower = searchTerm?.toLowerCase() || "";
    let filteredPosts = posts.filter((post) => {
      const title = post.title?.toLowerCase() || "";
      const content = post.content?.toLowerCase() || "";
      const tags = post.tags || [];

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTermLower) ||
        content.includes(searchTermLower) ||
        tags.some((tag) => tag?.toLowerCase().includes(searchTermLower));

      const matchesTag = !selectedTag || tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });

    // Sort posts: featured first, then by timestamp
    filteredPosts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.timestamp - a.timestamp;
    });

    return filteredPosts;
  };

  const getPostById = async (postId) => {
    try {
      // First check in loaded posts
      const loadedPost = posts.find((post) => post.id === postId);
      if (loadedPost) {
        return loadedPost;
      }

      // If not found, check in all posts
      const allPost = allPosts[postId];
      if (allPost) {
        return {
          id: postId,
          ...allPost,
        };
      }

      // If still not found, try to fetch directly from Firebase
      const postRef = ref(database, `blogPosts/${postId}`);
      const snapshot = await get(postRef);
      if (snapshot.exists()) {
        const postData = snapshot.val();
        return {
          id: postId,
          ...postData,
        };
      }

      console.log("Post not found in any location");
      return null;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  };

  const addBlog = async (postData) => {
    try {
      const postsRef = ref(database, "blogPosts");
      const newPostRef = push(postsRef);
      const timestamp = Date.now();
      const newPost = {
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timestamp: timestamp,
        tags: postData.tags || [], // Ensure tags is always an array
      };

      // If this post is featured, unfeature all other posts
      if (newPost.featured) {
        const snapshot = await get(postsRef);
        if (snapshot.exists()) {
          const updates = {};
          snapshot.forEach((childSnapshot) => {
            updates[`${childSnapshot.key}/featured`] = false;
          });
          await update(postsRef, updates);
        }
      }

      await set(newPostRef, newPost);
      return newPostRef.key;
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    }
  };

  const updateBlog = async (postId, postData) => {
    try {
      const postRef = ref(database, `blogPosts/${postId}`);
      const originalPost = await getPostById(postId);

      const updatedPost = {
        ...originalPost,
        ...postData,
        updatedAt: new Date().toISOString(),
        timestamp: Date.now(),
      };

      // If this post is being featured, unfeature all other posts
      if (updatedPost.featured) {
        const postsRef = ref(database, "blogPosts");
        const snapshot = await get(postsRef);
        if (snapshot.exists()) {
          const updates = {};
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.key !== postId) {
              updates[`${childSnapshot.key}/featured`] = false;
            }
          });
          await update(postsRef, updates);
        }
      }

      await update(postRef, updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  const deleteBlog = async (postId) => {
    try {
      const postRef = ref(database, `blogPosts/${postId}`);
      await remove(postRef);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  const refreshBlogs = () => {
    setLastLoadedTimestamp(null);
    setCurrentPage(1);
    fetchPosts();
  };

  const saveDraft = async (draft) => {
    try {
      const draftsRef = ref(database, "drafts");
      const newDraftRef = push(draftsRef);
      const newDraft = {
        ...draft,
        lastModified: new Date().toISOString(),
      };
      await set(newDraftRef, newDraft);
      const updatedDrafts = [...drafts, { id: newDraftRef.key, ...newDraft }];
      setDrafts(updatedDrafts);
      return newDraftRef.key;
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  };

  const loadDraft = async (draftId) => {
    try {
      if (!draftId) {
        setSelectedDraftId(null);
        return null;
      }

      const draftRef = ref(database, `drafts/${draftId}`);
      const snapshot = await get(draftRef);

      if (snapshot.exists()) {
        const draft = { id: draftId, ...snapshot.val() };
        setSelectedDraftId(draftId);
        return draft;
      }
      return null;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  };

  const deleteDraft = async (draftId) => {
    try {
      const draftRef = ref(database, `drafts/${draftId}`);
      await remove(draftRef);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (error) {
      console.error("Error deleting draft:", error);
      throw error;
    }
  };

  const updateDraft = async (draftId, draftData) => {
    try {
      const draftRef = ref(database, `drafts/${draftId}`);
      await update(draftRef, draftData);
      setDrafts((prev) =>
        prev.map((d) => (d.id === draftId ? { ...d, ...draftData } : d))
      );
    } catch (error) {
      console.error("Error updating draft:", error);
      throw error;
    }
  };

  // Add useEffect to fetch drafts
  useEffect(() => {
    const draftsRef = ref(database, "drafts");
    const unsubscribe = onValue(draftsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const draftsArray = Object.entries(data).map(([id, draft]) => ({
          id,
          ...draft,
        }));
        setDrafts(draftsArray);
      } else {
        setDrafts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to handle likes
  const toggleLike = async (postId) => {
    try {
      const currentLikes = likes[postId] || {};
      const userEmail = sessionStorage.getItem("user") || "anonymous";
      // Encode the email to make it a valid Firebase key
      const encodedEmail = userEmail.replace(/[.#$[/\]]/g, "_");

      if (currentLikes[encodedEmail]) {
        // Unlike
        const updates = {};
        updates[`likes/${postId}/${encodedEmail}`] = null;
        await update(ref(database), updates);
      } else {
        // Like
        const updates = {};
        updates[`likes/${postId}/${encodedEmail}`] = true;
        await update(ref(database), updates);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  // Function to get like count for a post
  const getLikeCount = (postId) => {
    return Object.keys(likes[postId] || {}).length;
  };

  // Function to check if current user has liked a post
  const hasUserLiked = (postId) => {
    const userEmail = sessionStorage.getItem("user") || "anonymous";
    // Encode the email to match the stored key
    const encodedEmail = userEmail.replace(/[.#$[/\]]/g, "_");
    return likes[postId]?.[encodedEmail] || false;
  };

  const value = {
    posts: getFilteredPosts(),
    loading,
    hasMoreData,
    currentPage,
    searchTerm,
    selectedTag,
    allTags,
    setSearchTerm,
    setSelectedTag,
    loadMorePosts,
    refreshBlogs,
    hasPostsInDb,
    addBlog,
    updateBlog,
    deleteBlog,
    drafts,
    saveDraft,
    loadDraft,
    deleteDraft,
    selectedDraftId,
    setSelectedDraftId,
    getPostById,
    postsPerPage,
    updateDraft,
    toggleLike,
    getLikeCount,
    hasUserLiked,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
