import { useEffect, useState } from "react";
import { Project } from "../../../api/project";
export default function AnimHeader({
  children,
  currentProject,
}: {
  children: string;
  currentProject: Project;
}) {
  const [text, setText] = useState(null);
  const [translate, setTranslate] = useState("0");
  const [opacity, setOpacity] = useState(100);
  const [scale, setScale] = useState(100);

  useEffect(() => {
    if (!text || !currentProject) {
      setText(children);
      return;
    }
    setTranslate("full");
    setOpacity(0);
    setScale(0);
    setTimeout(() => {
      setText(children);
      setTranslate("0");
      setOpacity(100);
      setScale(100);
    }, 300);
  }, [children, currentProject, text]);

  return (
    <h1
      className={`text-content-header text-2xl font-semibold transition-${
        opacity === 100 ? "opacity" : "all"
      } duration-200 transform -translate-x-${translate} opacity-${opacity} scale-${scale}`}
    >
      {text}
    </h1>
  );
}
