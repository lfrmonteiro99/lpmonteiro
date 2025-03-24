import React from "react";
import BlogList from "./BlogList";
import AddBlogPost from "./AddBlogPost";

const BlogSection = () => {
  return (
    <section id="blog" className="py-20 bg-[rgb(22 24 22/1)]">
      <div className="container mx-auto py-4 px-12 mt-16 md:mt-20">
        <h2 className="text-4xl font-bold text-center text-white mb-4">{`<Blog />`}</h2>
        <AddBlogPost />
        <BlogList />
      </div>
    </section>
  );
};

export default BlogSection;
