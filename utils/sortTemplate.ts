import { Template } from "../data/templates";

export default function sortTemplate(a: Template, b: Template) {
  return (a?.order ?? 0) - (b?.order ?? 0);
}
