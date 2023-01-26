export default function AuthText(props) {
  return (
    <p
      className={`font-normal text-sm mt-2 text-white lg:text-gray-500 ${props.className}`}
    >
      {props.children}
    </p>
  );
}
