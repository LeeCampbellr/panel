# SEO Analytics Panel

A lightweight React component for SEO and analytics debugging in development environments.

## Installation

### NPM (React/Next.js)

```bash
npm install seo-analytics-panel
```

### CDN (Any HTML)

```html
<script src="https://unpkg.com/seo-analytics-panel@latest/dist/seo-panel.umd.js"></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/seo-analytics-panel@latest/dist/seo-panel.css"
/>
```

## Usage

### React/Next.js

```tsx
import { useState } from "react";

import { SeoAnalyticsPanel } from "seo-analytics-panel";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle SEO Panel</button>
      <SeoAnalyticsPanel
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        position="right"
      />
    </div>
  );
}
```

**Don't forget to import the CSS:**

```tsx
import "seo-analytics-panel/dist/seo-panel.css";
```

### Vanilla JavaScript (Optional)

```html
<!DOCTYPE html>
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/seo-analytics-panel@latest/dist/seo-panel.css"
    />
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/seo-analytics-panel@latest/dist/seo-panel.umd.js"></script>
  </head>
  <body>
    <div id="panel-container"></div>

    <script>
      const container = document.getElementById("panel-container");
      const panel = createSeoPanel(container, {
        isOpen: true,
        position: "right",
      });

      // Update panel
      panel.render({ isOpen: false });

      // Cleanup
      panel.destroy();
    </script>
  </body>
</html>
```

## API

### React Component Props

- `isOpen?: boolean` - Controls panel visibility (default: false)
- `onToggle?: () => void` - Callback when close button is clicked
- `position?: 'right' | 'left'` - Panel position (default: 'right')

### Vanilla JS Helper (Optional)

- `createSeoPanel(container, props)` - Mount React component in container
- `panel.render(props)` - Update component props
- `panel.destroy()` - Unmount component

## Styling

The panel uses CSS modules for styling to avoid conflicts with your application. All styles are scoped and won't interfere with your existing CSS.

### Bundle Sizes

- **JavaScript (ES)**: ~511KB (90KB gzipped)
- **JavaScript (UMD)**: ~174KB (55KB gzipped)
- **CSS**: 1.34KB (0.58KB gzipped)

## Development

```bash
npm install
npm run dev          # Development server
npm run build:lib    # Build library
npm run build:types  # Generate TypeScript declarations
```

## License

MIT
