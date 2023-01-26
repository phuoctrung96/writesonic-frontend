import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { ReactNode, useEffect, useState } from "react";

const useStyles = makeStyles(() => ({
  customTooltip: {
    backgroundColor: "#374151",
    fontSize: "17px",
    padding: "5px 10px",
  },
  customArrow: {
    color: "#374151",
  },
}));

interface ToolTipProps {
  message: ReactNode | string;
  position?:
    | "bottom"
    | "left"
    | "right"
    | "top"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start";
  children: any;
}

const ToolTip = (props: ToolTipProps) => {
  const { message, position = "top", children } = props;

  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    function onScroll(e) {
      setOpen(false);
    }
    document.addEventListener("scroll", onScroll, true);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [open]);
  return (
    <>
      <Tooltip
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        classes={{
          tooltip: classes.customTooltip,
          arrow: classes.customArrow,
        }}
        title={message}
        placement={position}
        arrow
      >
        {children}
      </Tooltip>
    </>
  );
};

export default ToolTip;
