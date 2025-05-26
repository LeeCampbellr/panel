import { Panel } from "./lib/index";

import "./App.css";

function App() {
  return (
    <div className="test-app app">
      <Panel />

      <main className="app-main">
        <section className="sample-content">
          <h2>Testing</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>

          <h3>Headings Structure</h3>
          <h4>Subheading Level 4</h4>
          <h5>Subheading Level 5</h5>

          <img
            alt="Sample image for testing"
            src="https://via.placeholder.com/300x200"
          />

          <p>
            <a href="https://example.com" rel="noopener" target="_blank">
              External Link
            </a>{" "}
            |<a href="/internal-page">Internal Link</a>
          </p>

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "SEO Panel Test Page",
              description: "A test page for the SEO analytics panel",
            })}
          </script>
        </section>
      </main>
    </div>
  );
}

export default App;
