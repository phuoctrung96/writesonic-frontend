export default function FormLabel(props) {
  return (
    <label htmlFor={props.htmlFor} className={`text-sm ${props.className}`}>
      {props.children}
    </label>
  );
}
