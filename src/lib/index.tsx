import React, { useRef, useState } from "react";

import "./styles/index.css";

import { Drawer } from "./components/drawer/drawer";
import { Trigger } from "./components/trigger/trigger";

export const Panel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div data-panel ref={panelRef}>
      <Trigger isOpen={isOpen} setIsOpen={setIsOpen} />

      <Drawer isOpen={isOpen}>
        SEO and analytics debugging features coming soon...
      </Drawer>
    </div>
  );
};
