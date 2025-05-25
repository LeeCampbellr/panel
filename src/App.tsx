import { useState } from "react";

import { initSeoPanel, SeoAnalyticsPanel } from "./lib/index";

import "./lib/panel.module.css";
import "./App.css";

interface VanillaPanelInstance {
  toggle: () => void;
  show: () => void;
  hide: () => void;
  destroy: () => void;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [vanillaPanel, setVanillaPanel] = useState<VanillaPanelInstance | null>(
    null
  );

  const initVanillaPanel = () => {
    if (vanillaPanel) {
      vanillaPanel.destroy();
      setVanillaPanel(null);
    } else {
      const panel = initSeoPanel({
        containerId: "vanilla-panel-container",
        position: "left",
        showToggleButton: true,
      });
      setVanillaPanel(panel);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>SEO Analytics Panel - Test Environment</h1>
        <p>Test both React component and vanilla JS implementations</p>
      </header>

      <main className="app-main">
        {/* React Component Test */}
        <section className="test-section">
          <h2>React Component Test</h2>
          <div className="controls">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Close" : "Open"} React Panel
            </button>
            <span className="status">Status: {isOpen ? "Open" : "Closed"}</span>
          </div>
          <SeoAnalyticsPanel
            isOpen={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
            position="right"
            showToggleButton={false}
          />
        </section>

        {/* Vanilla JS Test */}
        <section className="test-section">
          <h2>Vanilla JS Test</h2>
          <div className="controls">
            <button onClick={initVanillaPanel}>
              {vanillaPanel ? "Destroy" : "Initialize"} Vanilla Panel
            </button>
            {vanillaPanel && (
              <>
                <button onClick={() => vanillaPanel.toggle()}>Toggle</button>
                <button onClick={() => vanillaPanel.show()}>Show</button>
                <button onClick={() => vanillaPanel.hide()}>Hide</button>
              </>
            )}
          </div>
          <div id="vanilla-panel-container"></div>
        </section>

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
