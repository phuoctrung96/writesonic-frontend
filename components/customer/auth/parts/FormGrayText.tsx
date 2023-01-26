export default function FormGrayText(props) {
  return (
    <p
      className={`text-sm text-gray-500 hover:auth-link-hover ${props.className}`}
    >
      {props.children}
    </p>
  );
}
