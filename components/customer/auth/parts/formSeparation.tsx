export default function FormSeparation(props) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm m-5">
        <span className="text-sm px-2 bg-white text-gray-500">
          {props.children}
        </span>
      </div>
    </div>
  );
}
