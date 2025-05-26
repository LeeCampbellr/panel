import React from "react";

import "./styles/index.css";

import { Panel as DraggablePanel } from "./components/Panel";

export const Panel: React.FC = () => {
  return (
    <div data-panel>
      <DraggablePanel>
        SEO and analytics debugging features coming soon...
      </DraggablePanel>
    </div>
  );
};
