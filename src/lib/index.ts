import React from "react";

import { createRoot, Root } from "react-dom/client";

import styles from "./panel.module.css";

// Main panel component (you'll build this)
export interface SeoAnalyticsPanelProps {
  isOpen?: boolean;
  onToggle?: () => void;
  position?: "right" | "left";
  showToggleButton?: boolean;
}

// Placeholder component - replace with your actual panel
const SeoAnalyticsPanel: React.FC<SeoAnalyticsPanelProps> = ({
  isOpen = false,
  onToggle,
  position = "right",
  showToggleButton = false,
}) => {
  const panelClasses = [
    styles.panel,
    styles[position],
    isOpen ? styles.open : "",
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement("div", null, [
    // Toggle button
    showToggleButton &&
      React.createElement(
        "button",
        {
          key: "toggle-button",
          className: styles.toggleButton,
          onClick: onToggle,
          "aria-label": "Toggle SEO Panel",
        },
        "🔍"
      ),

    // Panel
    React.createElement(
      "div",
      {
        key: "panel",
        className: panelClasses,
      },
      [
        React.createElement(
          "div",
          {
            key: "header",
            className: styles.header,
          },
          "SEO Analytics Panel"
        ),

        React.createElement(
          "div",
          {
            key: "content",
            className: styles.content,
          },
          "SEO and analytics debugging features coming soon..."
        ),
      ]
    ),
  ]);
};

// React component export
export { SeoAnalyticsPanel };

// Vanilla JS initialization function
export function initSeoPanel(
  options: {
    containerId?: string;
    position?: "right" | "left";
    showToggleButton?: boolean;
  } = {}
): {
  toggle: () => void;
  show: () => void;
  hide: () => void;
  destroy: () => void;
} {
  const {
    containerId = "seo-panel-root",
    position = "right",
    showToggleButton = true,
  } = options;

  let isOpen = false;
  let container = document.getElementById(containerId);
  let root: Root | null = null;

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  const toggle = () => {
    isOpen = !isOpen;
    render();
  };

  const show = () => {
    isOpen = true;
    render();
  };

  const hide = () => {
    isOpen = false;
    render();
  };

  const render = () => {
    if (!root && container) {
      root = createRoot(container);
    }
    if (root) {
      root.render(
        React.createElement(SeoAnalyticsPanel, {
          isOpen,
          onToggle: toggle,
          position,
          showToggleButton,
        })
      );
    }
  };

  const destroy = () => {
    if (root) {
      root.unmount();
      root = null;
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  // Initial render
  render();

  return { toggle, show, hide, destroy };
}

// Global initialization for script tag usage
declare global {
  interface Window {
    SeoPanel: typeof initSeoPanel;
  }
}

// Auto-attach to window for UMD builds
if (typeof window !== "undefined") {
  (window as Window & { SeoPanel: typeof initSeoPanel }).SeoPanel =
    initSeoPanel;
}
