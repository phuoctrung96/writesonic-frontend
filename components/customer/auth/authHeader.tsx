export default function AuthHeader(props) {
  return (
    <p
      className={`font-extrabold text-2xl lg:text-3xl text-white lg:text-black ${props.className}`}
    >
      {props.children}
    </p>
  );
}
