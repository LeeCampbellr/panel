# SEO Analytics Panel

A lightweight, framework-agnostic panel for SEO and analytics debugging in development environments.

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
import { SeoAnalyticsPanel } from "seo-analytics-panel";
import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle SEO Panel</button>
      <SeoAnalyticsPanel
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        position="right"
        showToggleButton={true}
      />
    </div>
  );
}
```

**Don't forget to import the CSS:**

```tsx
import "seo-analytics-panel/dist/seo-panel.css";
```

### Vanilla JavaScript

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
    <script>
      // Initialize with toggle button
      const panel = SeoPanel({
        position: "right",
        showToggleButton: true,
      });

      // Manual controls
      // panel.show();
      // panel.hide();
      // panel.toggle();
    </script>
  </body>
</html>
```

### ES Modules

```javascript
import { initSeoPanel } from "seo-analytics-panel";
import "seo-analytics-panel/dist/seo-panel.css";

const panel = initSeoPanel({
  position: "right",
  showToggleButton: true,
});

// Toggle panel
panel.toggle();

// Show/hide explicitly
panel.show();
panel.hide();

// Cleanup when done
panel.destroy();
```

## API

### React Component Props

- `isOpen?: boolean` - Controls panel visibility
- `onToggle?: () => void` - Callback when panel toggles
- `position?: 'right' | 'left'` - Panel position (default: 'right')
- `showToggleButton?: boolean` - Show floating toggle button (default: false)

### JavaScript API

- `initSeoPanel(options)` - Initialize panel
- `panel.toggle()` - Toggle panel visibility
- `panel.show()` - Show panel
- `panel.hide()` - Hide panel
- `panel.destroy()` - Remove panel and cleanup

### Options

- `containerId?: string` - Container element ID (default: 'seo-panel-root')
- `position?: 'right' | 'left'` - Panel position (default: 'right')
- `showToggleButton?: boolean` - Show floating toggle button (default: true)

## Styling

The panel uses CSS modules for styling to avoid conflicts with your application. All styles are scoped and won't interfere with your existing CSS.

### Bundle Sizes

- **JavaScript (ES)**: 511KB (90KB gzipped)
- **JavaScript (UMD)**: 174KB (55KB gzipped)
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
