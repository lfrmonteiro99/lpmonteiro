import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../Firebase/firebase.conf";
import imageCompression from "browser-image-compression";
import { useBlog } from "../../Context/BlogContext";

const MenuBar = ({ editor, onShowHtml, uploadedImagesRef, onSaveDraft }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  if (!editor) {
    return null;
  }

  const handleButtonClick = (callback) => (e) => {
    e.preventDefault();
    callback();
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 1920, // Max width/height for large images
      useWebWorker: true, // Use Web Worker for better performance
      fileType: "image/webp", // Convert to WebP for better compression
      initialQuality: 0.8, // Initial quality (0 to 1)
      alwaysKeepResolution: true, // Always maintain resolution
      signal: undefined, // Abort signal
      minFileSize: 1024, // Min file size in bytes
      maxFileSize: 1048576, // Max file size in bytes (1MB)
      onProgress: undefined, // Progress callback
      onStart: undefined, // Start callback
      onEnd: undefined, // End callback
      onError: undefined, // Error callback
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file; // Return original file if compression fails
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Compress the image before upload
      const compressedFile = await compressImage(file);
      console.log("Original size:", file.size / 1024 / 1024, "MB");
      console.log("Compressed size:", compressedFile.size / 1024 / 1024, "MB");

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${compressedFile.name.replace(
        /\.[^/.]+$/,
        ""
      )}.webp`;

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `blog-images/${filename}`);

      // Upload the compressed file
      await uploadBytes(storageRef, compressedFile);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Insert the image into the editor with metadata
      editor
        .chain()
        .focus()
        .setImage({
          src: downloadURL,
          "data-storage-path": `blog-images/${filename}`,
        })
        .run();

      // Wait for a brief moment to ensure the editor has processed the image
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Add the storage path to the set of uploaded images after the editor has processed it
      uploadedImagesRef.current.add(`blog-images/${filename}`);
      console.log("Added image to tracking:", `blog-images/${filename}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSavingDraft(true);
      const content = editor.getHTML();
      await onSaveDraft(content);
      console.log("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-700 rounded-md">
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleBold().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("bold") ? "bg-gray-600" : "hover:bg-gray-600"
        }`}
      >
        bold
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleItalic().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("italic") ? "bg-gray-600" : "hover:bg-gray-600"
        }`}
      >
        italic
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleBulletList().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("bulletList") ? "bg-gray-600" : "hover:bg-gray-600"
        }`}
      >
        bullet list
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleOrderedList().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("orderedList") ? "bg-gray-600" : "hover:bg-gray-600"
        }`}
      >
        ordered list
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        )}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-gray-600"
            : "hover:bg-gray-600"
        }`}
      >
        h1
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        )}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-gray-600"
            : "hover:bg-gray-600"
        }`}
      >
        h2
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleBlockquote().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("blockquote") ? "bg-gray-600" : "hover:bg-gray-600"
        }`}
      >
        quote
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleCodeBlock().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("codeBlock") ? "bg-gray-600" : "hover:bg-gray-600"
        }`}
      >
        code
      </button>
      <button
        type="button"
        onClick={handleButtonClick(() =>
          editor.chain().focus().setHorizontalRule().run()
        )}
        className="p-2 rounded hover:bg-gray-600"
      >
        hr
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      <button
        type="button"
        onClick={handleButtonClick(() => fileInputRef.current?.click())}
        className={`p-2 rounded hover:bg-gray-600 ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isUploading}
      >
        {isUploading ? "uploading..." : "upload image"}
      </button>
      <button
        type="button"
        onClick={handleButtonClick(addImage)}
        className="p-2 rounded hover:bg-gray-600"
      >
        image URL
      </button>
      <button
        type="button"
        onClick={handleButtonClick(handleSaveDraft)}
        className={`p-2 rounded hover:bg-gray-600 ${
          isSavingDraft ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSavingDraft}
      >
        {isSavingDraft ? "Saving..." : "Save Draft"}
      </button>
      <button
        type="button"
        onClick={handleButtonClick(onShowHtml)}
        className="p-2 rounded hover:bg-gray-600"
      >
        HTML
      </button>
    </div>
  );
};

const HtmlModal = ({ html, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">HTML Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code className="text-gray-300 text-sm whitespace-pre-wrap">
            {html}
          </code>
        </pre>
      </div>
    </div>
  );
};

const RichTextEditor = ({
  content,
  onChange,
  showPreview = false,
  onSaveDraft,
  onImageSuggestion,
  suggestedImages,
  onSelectImage,
}) => {
  const [showHtml, setShowHtml] = useState(false);
  const [height, setHeight] = useState(500);
  const resizeRef = useRef(null);
  const startYRef = useRef(null);
  const startHeightRef = useRef(null);
  const uploadedImagesRef = useRef(new Set());
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(!showPreview);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [showImageSuggestions, setShowImageSuggestions] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  };

  const handleImagePrompt = async () => {
    if (!imagePrompt.trim()) return;
    await onImageSuggestion(imagePrompt);
    setShowImageSuggestions(true);
  };

  const insertImage = (imageUrl) => {
    if (cursorPosition) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStart(cursorPosition, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Blog content image";
    img.className = "max-w-full h-auto rounded-lg my-4";
    document.execCommand("insertNode", false, img);
    setShowImageSuggestions(false);
    setImagePrompt("");
  };

  const handleImageSelect = (imageUrl) => {
    insertImage(imageUrl);
    onSelectImage(imageUrl);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setCursorPosition(range.startContainer);
    }
  };

  if (showPreview) {
    return (
      <div className="flex flex-col h-full">
        <MenuBar
          editor={editorRef}
          onShowHtml={() => setShowHtml(true)}
          uploadedImagesRef={uploadedImagesRef}
          onSaveDraft={onSaveDraft}
        />
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto border border-gray-700 rounded-lg">
              <EditorContent editor={editorRef} />
            </div>
            {showPreview && (
              <div className="mt-4 flex-1 overflow-y-auto border border-gray-700 rounded-lg p-4 bg-gray-900">
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: editorRef.current?.innerHTML || "",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showPreview && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => document.execCommand("bold", false, null)}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Bold
          </button>
          <button
            onClick={() => document.execCommand("italic", false, null)}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Italic
          </button>
          <button
            onClick={() =>
              document.execCommand("insertUnorderedList", false, null)
            }
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Bullet List
          </button>
          <button
            onClick={() =>
              document.execCommand("insertOrderedList", false, null)
            }
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Numbered List
          </button>
          <button
            onClick={() => document.execCommand("createLink", false, "#")}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Link
          </button>
        </div>
      )}

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!showPreview}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseUp={saveSelection}
          className={`min-h-[300px] p-4 bg-gray-700 text-white rounded-lg ${
            showPreview ? "cursor-default" : "cursor-text"
          }`}
        />

        {!showPreview && (
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe an image to insert..."
                className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleImagePrompt}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
              >
                Suggest Images
              </button>
            </div>

            {showImageSuggestions && suggestedImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-300 mb-4">
                  Suggested Content Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Suggested image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleImageSelect(imageUrl)}
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-lg transition-opacity"
                      >
                        Insert Image
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!showPreview && (
        <div className="flex justify-end">
          <button
            onClick={() => onSaveDraft(content)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
          >
            Save Draft
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
