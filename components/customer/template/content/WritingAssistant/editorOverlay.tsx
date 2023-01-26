import { Box, LinearProgress, withStyles } from "@material-ui/core";
import React from "react";

const styles = {
  root: {
    flexGrow: 1,
  },
  colorPrimary: {
    background: "green",
  },
};

const EditOverLay: React.FC = () => {
  return (
    <div className="absolute left0 top-0 w-full h-full bg-white bg-opacity-0 cursor-wait z-30">
      <Box className="w-full">
        <BorderLinearProgress />
      </Box>
    </div>
  );
};

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 2,
  },
  colorPrimary: {
    backgroundColor: "#fff",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "rgb(236, 72, 153)",
    // animationDuration: "8s",
  },
}))(LinearProgress);

export default EditOverLay;
