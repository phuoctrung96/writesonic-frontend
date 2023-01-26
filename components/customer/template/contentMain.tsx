export default function ContentMain(props) {
  return (
    <main
      className={`block md:grid grid-cols-6 xl:grid-cols-5 overflow-y-auto auto-cols-min flex-1 ${props.className}`}
    >
      {props.children}
    </main>
  );
}
