import { forwardRef, useState } from "react";
import Star from "./star";

const Rating = forwardRef<
  HTMLDivElement,
  { value?: number; onChange?: (value: number) => void }
>(({ value, onChange, ...props }, ref) => {
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const handleClick = (e: any, index: number) => {
    e.stopPropagation();
    if (!onChange) {
      return;
    }
    if (value == 1 && index == 0) {
      setFocusIndex(-1);
      onChange(0);
    } else {
      onChange(index + 1);
    }
  };
  return (
    <div
      ref={ref}
      {...props}
      className="grid grid-cols-5 "
      onMouseLeave={() => {
        setFocusIndex(-1);
      }}
    >
      {Array(5)
        ?.fill("")
        ?.map((val, index) => {
          return (
            <Star
              selected={index < value}
              focused={index <= focusIndex}
              key={index}
              index={index}
              onClick={(e) => handleClick(e, index)}
              onMouseOver={() => setFocusIndex(index)}
            />
          );
        })}
    </div>
  );
});

Rating.displayName = "Rating";

export default Rating;
