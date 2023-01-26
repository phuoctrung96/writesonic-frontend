import React, { useState } from "react";
import { createPortal } from "react-dom";

export const IFrameLandingPage = ({ children }) => {
  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe
      ref={setContentRef}
      className="w-full h-full border-none"
      width="100%"
      height="1000"
      scrolling="no"
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
