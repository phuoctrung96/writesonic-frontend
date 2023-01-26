/* This example requires Tailwind CSS v2.0+ */
import { Switch } from "@headlessui/react";
import useTranslation from "next-translate/useTranslation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AnnualSwitch({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: any;
}) {
  const { t } = useTranslation();
  return (
    <Switch.Group as="div" className="flex items-center justify-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? "bg-indigo-600" : "bg-gray-200",
          "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-900">
          {t("settings:annual_billing")}
        </span>
        <span className="text-sm ml-1 text-green-600">(2 months FREE)</span>
      </Switch.Label>
    </Switch.Group>
  );
}
