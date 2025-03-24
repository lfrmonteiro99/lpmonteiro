import React from "react";
import BlogList from "./BlogList";
import AddBlogPost from "./AddBlogPost";

const BlogSection = () => {
  return (
    <section id="blog" className="py-20 bg-[rgb(22 24 22/1)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Blog</h2>
        <AddBlogPost />
        <BlogList />
      </div>
    </section>
  );
};

export default BlogSection;
