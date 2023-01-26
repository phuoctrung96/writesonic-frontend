import { RadioGroup } from "@headlessui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Copy } from "../../../../../api/copy";
import NextButton from "../../../../buttons/nextButton";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RadioBoxes({
  lists,
  onNext,
}: {
  lists: Copy[];
  onNext: Function;
}) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(lists[0]);

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
      <div className="rounded-md">
        {Array.isArray(lists) &&
          lists?.map(({ id, data }, index) => (
            <RadioGroup.Option
              key={index}
              value={id}
              className={({ checked }) =>
                classNames(
                  checked ? "border-indigo-600" : "border-gray-100",
                  "relative p-5 flex cursor-pointer focus:outline-none my-3 bg-white rounded-lg border-2"
                )
              }
            >
              {({ active, checked }) => (
                <div className="flex items-center w-full">
                  <span
                    className={classNames(
                      checked
                        ? "bg-indigo-600 border-transparent"
                        : "bg-white border-gray-300",
                      active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                      "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <div className="ml-3 flex justify-between items-center w-full">
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-900" : "text-gray-900",
                        "block text-sm font-medium"
                      )}
                    >
                      {typeof data?.text === "object" ? (
                        data?.text?.map((text, index) => (
                          <p key={index} className="text-base text-gray-700">
                            <span className="text-base text-gray-600 mr-2">
                              Section {index + 1}:
                            </span>
                            {text}
                          </p>
                        ))
                      ) : (
                        <>{data?.text ?? ""}</>
                      )}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                      )}
                    >
                      {checked && (
                        <NextButton
                          onClick={() => {
                            onNext(data?.text ?? "");
                          }}
                        />
                      )}
                    </RadioGroup.Description>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
      </div>
    </RadioGroup>
  );
}
