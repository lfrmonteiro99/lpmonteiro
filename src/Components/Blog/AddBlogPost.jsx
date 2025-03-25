import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../../Context/BlogContext";
import RichTextEditor from "./RichTextEditor";
import { storage } from "../../Firebase/firebase.conf";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { geminiModel } from "../../Firebase/firebase.conf";

const AddBlogPost = () => {
  const navigate = useNavigate();
  const {
    addBlog,
    drafts,
    saveDraft,
    loadDraft,
    deleteDraft,
    selectedDraftId,
    updateDraft,
    getPostById,
    updateBlog,
  } = useBlog();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [context, setContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isUrlProcessing, setIsUrlProcessing] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Get post ID from URL if editing
  const { postId } = useParams();

  // Load post data if editing
  useEffect(() => {
    const loadPostData = async () => {
      if (postId) {
        try {
          const postData = await getPostById(postId);
          if (postData) {
            setTitle(postData.title);
            setContent(postData.content);
            setSummary(postData.summary);
            setTags(postData.tags || []);
            setIsFeatured(postData.isFeatured || false);
            if (postData.image) {
              setImagePreview(postData.image);
            }
          }
        } catch (error) {
          console.error("Error loading post data:", error);
          setError("Failed to load post data");
        }
      }
    };

    loadPostData();
  }, [postId, getPostById]);

  // Check if user is authorized from sessionStorage
  const isAuthorized = () => {
    const user = sessionStorage.getItem("user");
    return user === "lfrmonteiro99@gmail.com";
  };

  // Redirect if not authorized
  useEffect(() => {
    if (!isAuthorized()) {
      navigate("/");
    }
  }, [navigate]);

  // Auto-save functionality
  useEffect(() => {
    if (title || content) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      const timeout = setTimeout(() => {
        handleSaveDraft(content, false);
      }, 3000);
      setAutoSaveTimeout(timeout);
    }
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [title, content]);

  // Add useEffect to handle initial content
  useEffect(() => {
    if (content) {
      setContent(content);
    }
  }, [content]);

  // If not authorized, don't render the component
  if (!isAuthorized()) {
    return null;
  }

  const clearForm = () => {
    setTitle("");
    setContent("");
    setSummary("");
    setError(null);
    setImageFile(null);
    setImagePreview(null);
    setTags([]);
    setTagInput("");
    setContext("");
    setIsGenerating(false);
    setUrlInput("");
    setIsFeatured(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = async (content, shouldClearForm = false) => {
    try {
      if (!title.trim()) {
        setError("Title is required to save a draft");
        return;
      }

      const draftData = {
        title: title.trim(),
        content,
        tags: tags,
        lastModified: new Date().toISOString(),
      };

      if (selectedDraftId) {
        await updateDraft(selectedDraftId, draftData);
      } else {
        await saveDraft(draftData);
      }

      if (shouldClearForm) {
        clearForm();
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setError("Failed to save draft. Please try again.");
    }
  };

  const handleLoadDraft = async (draftId) => {
    if (!draftId) {
      clearForm();
      loadDraft(null);
      return;
    }

    try {
      const draft = await loadDraft(draftId);
      if (draft) {
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setTags(draft.tags || []);
      }
    } catch (error) {
      console.error("Error loading draft:", error);
      setError("Failed to load draft. Please try again.");
    }
  };

  const handleDeleteDraft = async (draftId) => {
    try {
      await deleteDraft(draftId);
      if (selectedDraftId === draftId) {
        clearForm();
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      setError("Failed to delete draft. Please try again.");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        setIsUploading(true);
        const storageRef = ref(
          storage,
          `blog-images/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const postData = {
        title,
        content,
        summary,
        tags,
        image: imageUrl,
        isFeatured,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (postId) {
        // Update existing post
        await updateBlog(postId, postData);
      } else {
        // Create new post
        await addBlog(postData);
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving post:", error);
      setError("Failed to save post. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleContextSubmit = async (e) => {
    e.preventDefault();
    if (!context.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Generate blog post using Gemini
      const prompt = `Create a blog post based on this context. Format your response exactly as follows:

Title: [Your catchy title here]

Summary: [A concise 2-3 sentence summary of the main points of the blog post]

Content: [Your blog post content here in HTML format. Use <p> tags for paragraphs, <h2> for subtitles, and <ul>/<li> for lists. Include a clear introduction and conclusion.]

Tags: [tag1, tag2, tag3, tag4, tag5]

Context to use:
${context}

Requirements:
- Write in an engaging, professional blog style
- Include a clear introduction and conclusion
- Break content into paragraphs using <p> tags
- If the context is brief, expand it with relevant insights
- Make the content informative and valuable to readers
- The summary should be concise and capture the main points`;

      const result = await geminiModel.generateContent(prompt);

      const response = result.response;
      const generatedContent = response.text();

      // Parse the AI response
      const titleMatch = generatedContent.match(/Title: (.*?)(?:\n|$)/);
      const summaryMatch = generatedContent.match(
        /Summary: (.*?)(?:\nContent:|$)/s
      );
      const contentMatch = generatedContent.match(
        /Content:\s*([\s\S]*?)(?=\nTags:|$)/
      );
      const tagsMatch = generatedContent.match(/Tags: (.*?)(?:\n|$)/);

      if (titleMatch) setTitle(titleMatch[1].trim());
      if (summaryMatch) setSummary(summaryMatch[1].trim());
      if (contentMatch) {
        const content = contentMatch[1].trim();
        setContent(content);
      }
      if (tagsMatch) {
        // Clean up the tags string by removing brackets and extra spaces
        const tagsString = tagsMatch[1].replace(/[[\]]/g, "").trim();
        const extractedTags = tagsString.split(",").map((tag) => tag.trim());
        "Setting tags:", extractedTags;
        setTags(extractedTags);
      }

      setContext(""); // Clear the context input after successful processing
    } catch (error) {
      console.error("Error generating blog post:", error);
      setError(
        "Failed to generate blog post. Please try again with a different context."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUrlProcessing(true);
    setError(null);

    try {
      // Use a CORS proxy to fetch the content
      const corsProxy = "https://api.allorigins.win/raw?url=";
      const urlResponse = await fetch(corsProxy + encodeURIComponent(urlInput));

      if (!urlResponse.ok) {
        throw new Error("Failed to fetch content from URL");
      }

      const html = await urlResponse.text();

      // Create a temporary DOM element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Extract the main content
      // Try to find the main content area (common blog post containers)
      const mainContent =
        doc.querySelector(
          "article, .post-content, .entry-content, .blog-post, main, .content, .article, .post, .blog-content"
        ) || doc.body;

      // Remove unwanted elements
      const unwantedElements = mainContent.querySelectorAll(
        "script, style, nav, header, footer, .comments, .sidebar, .advertisement, .social-share, .related-posts, .newsletter-signup"
      );
      unwantedElements.forEach((el) => el.remove());

      // Get the text content
      const content = mainContent.textContent.trim();

      if (!content) {
        throw new Error("No content found at the specified URL");
      }

      // Generate blog post using Gemini
      const prompt = `Please analyze this blog post content and create a new blog post. Include:
      1. A catchy title (different from the original)
      2. Main content (rewritten in your own style, don't copy directly) in HTML format using <p> tags for paragraphs, <h2> for subtitles, and <ul>/<li> for lists
      3. Relevant tags (max 5)
      
      Original content:
      ${content}
      
      Note: Please ensure the content is original and not a direct copy. Focus on providing unique insights and perspectives. If the content is small, add more insights and perspectives.`;

      const result = await geminiModel.generateContent(prompt);
      const aiResponse = result.response;
      const generatedContent = aiResponse.text();

      // Parse the AI response
      const titleMatch = generatedContent.match(/Title: (.*?)(?:\n|$)/);
      const contentMatch = generatedContent.match(
        /Content: ([\s\S]*?)(?:\nTags:|$)/
      );
      const tagsMatch = generatedContent.match(/Tags: (.*?)(?:\n|$)/);

      if (titleMatch) setTitle(titleMatch[1].trim());
      if (contentMatch) {
        const content = contentMatch[1].trim();
        setContent(content);
      }
      if (tagsMatch) {
        // Clean up the tags string by removing brackets and extra spaces
        const tagsString = tagsMatch[1].replace(/[[\]]/g, "").trim();
        const extractedTags = tagsString.split(",").map((tag) => tag.trim());
        setTags(extractedTags);
      }

      setUrlInput(""); // Clear the URL input after successful processing
    } catch (error) {
      console.error("Error generating blog post from URL:", error);
      setError(
        "Failed to generate blog post from URL. Please try again. Make sure the URL is accessible and contains blog content."
      );
    } finally {
      setIsUrlProcessing(false);
    }
  };

  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!imageSearchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          imageSearchQuery
        )}&per_page=12`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching images:", error);
      setError("Failed to search images. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setImagePreview(image.urls.regular);
    setSearchResults([]);
    setImageSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Add New Blog Post</h1>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-600 text-white rounded-md">{error}</div>
      )}

      {/* URL Input */}
      <div className="mb-6">
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Generate from URL
        </label>
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            id="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter blog post URL"
            className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isUrlProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-pointer"
          >
            {isUrlProcessing ? "Processing..." : "Generate"}
          </button>
        </form>
      </div>

      {/* Context Input */}
      <div className="mb-6">
        <label
          htmlFor="context"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Or Generate from Context
        </label>
        <form onSubmit={handleContextSubmit} className="space-y-2">
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter your blog post context, topic, or idea..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-pointer"
            >
              {isGenerating ? "Generating..." : "Generate Blog Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Drafts Select */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedDraftId || ""}
            onChange={(e) => handleLoadDraft(e.target.value)}
            className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">New Post</option>
            {drafts.map((draft) => (
              <option key={draft.id} value={draft.id} className="truncate">
                {draft.title
                  ? `${draft.title.slice(0, 30)}${
                      draft.title.length > 30 ? "..." : ""
                    }`
                  : "Untitled Draft"}{" "}
                ({new Date(draft.lastModified).toLocaleDateString()})
              </option>
            ))}
          </select>
          {selectedDraftId && (
            <button
              onClick={() => handleDeleteDraft(selectedDraftId)}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors cursor-pointer"
            >
              Delete Draft
            </button>
          )}
        </div>
      </div>
      <hr className="my-4 text-white" />
      <p className="text-center text-white">or</p>
      <hr className="my-4 text-white" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter a brief summary of your blog post..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
          />
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-gray-300 cursor-pointer"
          >
            Featured Post
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Cover Image
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="px-4 py-2 bg-gray-700 text-white rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
            >
              {imagePreview ? "Change Image" : "Choose Image"}
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors cursor-pointer"
              >
                Remove Image
              </button>
            )}
          </div>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Image Search */}
        <div className="mb-6">
          <label
            htmlFor="imageSearch"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Search for Cover Image
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="imageSearch"
              value={imageSearchQuery}
              onChange={(e) => setImageSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleImageSearch(e);
                }
              }}
              placeholder="Search for an image..."
              className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleImageSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImage?.id === image.id
                      ? "ring-2 ring-blue-500"
                      : "hover:ring-2 hover:ring-gray-500"
                  }`}
                  onClick={() => handleSelectImage(image)}
                >
                  <img
                    src={image.urls.thumb}
                    alt={image.alt_description || "Search result"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags Input */}
        <div className="mb-6">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-200 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag and press Enter"
              className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Content
          </label>
          <RichTextEditor
            key={selectedDraftId || "new-post"}
            content={content}
            onChange={setContent}
            showPreview={false}
            onSaveDraft={handleSaveDraft}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSaveDraft(content, true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-pointer"
          >
            {isSubmitting || isUploading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogPost;
