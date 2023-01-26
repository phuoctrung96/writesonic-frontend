import { Disclosure } from "@headlessui/react";
import { useState } from "react";

export default function AnimDisclousreButton({
  normalStyle,
  focusStyle,
  children,
}) {
  const [isDown, down] = useState(false);

  const eventHandler = (event) => {
    down(event.type === "mousedown");
  };
  return (
    <Disclosure.Button
      className={`${normalStyle} ${isDown ? focusStyle : ""}`}
      onMouseDown={eventHandler}
      onMouseUp={eventHandler}
    >
      {children}
    </Disclosure.Button>
  );
}
