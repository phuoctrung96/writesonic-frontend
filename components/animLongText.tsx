import { useCallback, useRef, useState } from "react";

const AnimLongText: React.FC<{ children }> = ({ children }) => {
  const parentWidth = 300;
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [translateX, setTranslateX] = useState(0);
  const refP = useRef<HTMLParagraphElement>(null);

  const handleEvent = useCallback(
    (ev) => {
      if (!refP.current) {
        return;
      }
      const width = refP.current.clientWidth;
      if (width < parentWidth) {
        return;
      }
      if (ev.type === "mouseenter") {
        const percent = ((parentWidth - width) / width) * 100;
        setTranslateX(percent);
        setTransitionDuration((width / parentWidth) * 4000);
      } else {
        setTranslateX(0);
        setTransitionDuration(500);
      }
    },
    [refP]
  );

  return (
    <div
      className="overflow-hidden relative h-8 flex items-center"
      onMouseEnter={handleEvent}
      onMouseLeave={handleEvent}
      style={{ width: `${parentWidth}px` }}
    >
      <p
        ref={refP}
        className="transition-transform ease-linear"
        style={{
          transitionDuration: `${transitionDuration}ms`,
          transform: `translateX(${translateX}%)`,
          paddingRight: "30px",
          paddingLeft: "30px",
        }}
      >
        {children}
      </p>
      <div className="absolute top-0 left-0 h-full w-12 bg-white-left-arrow" />
      <div className="absolute top-0 right-0 h-full w-12 bg-white-right-arrow" />
    </div>
  );
};

export default AnimLongText;
