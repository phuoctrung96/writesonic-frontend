import { CheckCircleIcon } from "@heroicons/react/solid";

export default function IntroText(props) {
  return (
    <>
      <div className={`flex ${props.className}`}>
        <CheckCircleIcon className="flex-none w-5 h-5" fill="#c4c3e1" />
        <div className="ml-3">
          <p className="text-white font-medium text-base">{props.title}</p>
          <p className="mt-2 text-white font-light text-base opacity-80">
            {props.content}
          </p>
        </div>
      </div>
    </>
  );
}
