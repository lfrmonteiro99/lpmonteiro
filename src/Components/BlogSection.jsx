import React from "react";
import BlogList from "./BlogList";
import AddBlogPost from "./AddBlogPost";

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-[rgb(22 24 22/1)]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Latest Articles
        </h2>
        <AddBlogPost />
        <BlogList />
      </div>
    </section>
  );
}
