import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main>
      <nav aria-label="Main navigation">
        <a className="wordmark" href="#top">H/STUDIO</a>
        <span>Portraits, drawn by hand</span>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow">Something personal is taking shape.</p>
        <h1>Faces, feelings,<br /><em>beautifully observed.</em></h1>
        <p className="intro">
          H Studio creates expressive portrait drawings from the photographs and
          stories you care about most.
        </p>
        <a className="cta" href="mailto:hello@example.com">Say hello <span aria-hidden="true">↗</span></a>
        <div className="sketch" aria-hidden="true">
          <div className="oval" />
          <div className="line line-one" />
          <div className="line line-two" />
          <span>opening soon</span>
        </div>
      </section>

      <footer>
        <span>Original work. Human touch.</span>
        <span>© {new Date().getFullYear()} H Studio</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>,
);
