export const blogPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    summary: "Learn the basics of React and how to set up your first project.",
    content: `
      <p>React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible.</p>
      <h3>Setting Up Your Environment</h3>
      <p>To get started with React, you'll need Node.js installed on your machine. Then you can create a new React app using:</p>
      <pre><code>npx create-react-app my-app</code></pre>
      <p>Or with Vite, which is what your project uses:</p>
      <pre><code>npm create vite@latest my-app -- --template react</code></pre>
      <p>This sets up a new React project with all the necessary dependencies and configuration.</p>
    `,
    date: "2023-10-15",
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    id: 2,
    title: "Advanced CSS Techniques",
    summary: "Explore modern CSS techniques to create stunning UI effects.",
    content: `
      <p>CSS has evolved significantly in recent years, offering powerful features for creating complex layouts and animations.</p>
      <h3>CSS Grid Layout</h3>
      <p>CSS Grid is a two-dimensional layout system that can handle both columns and rows:</p>
      <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}</code></pre>
      <h3>CSS Custom Properties</h3>
      <p>Custom properties (variables) allow you to store values for reuse throughout your stylesheet:</p>
      <pre><code>:root {
  --primary-color: #3490dc;
}

.button {
  background-color: var(--primary-color);
}</code></pre>
    `,
    date: "2023-11-02",
    tags: ["CSS", "Web Design", "Frontend"],
  },
  // Add more blog posts as needed
];
