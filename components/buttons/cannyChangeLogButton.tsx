import { BellIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import React from "react";

export default class CannyChangeLogButton extends React.Component<{
  className?: string;
}> {
  componentDidMount() {
    window["Canny"]("initChangelog", {
      appID: process.env.NEXT_PUBLIC_CANNY_APP_ID,
      position: "bottom",
      align: "right",
    });
  }

  componentWillUnmount() {
    window["Canny"]("closeChangelog");
  }

  render() {
    return (
      <button
        data-canny-changelog
        className={classNames(
          this.props.className ?? "p-2 mr-2 text-gray-600 hover:text-gray-800"
        )}
      >
        <BellIcon className="w-5 h-5" />
      </button>
    );
  }
}
