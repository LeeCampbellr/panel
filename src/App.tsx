import { Panel } from "./lib/index";

import "./App.css";

function App() {
  return (
    <div className="test-app app">
      <Panel />

      <header className="app-header">
        <h1>SEO Analytics Panel - Test Environment</h1>
        <p>Test the React component implementation</p>
      </header>

      <main className="app-main">
        {/* Sample Content for Testing */}
        <section className="sample-content">
          <h2>Sample Content for SEO Testing</h2>
          <p>This content helps test the panel's SEO analysis features.</p>

          <h3>Headings Structure</h3>
          <h4>Subheading Level 4</h4>
          <h5>Subheading Level 5</h5>

          <img
            src="https://via.placeholder.com/300x200"
            alt="Sample image for testing"
          />

          <p>
            <a href="https://example.com" target="_blank" rel="noopener">
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
