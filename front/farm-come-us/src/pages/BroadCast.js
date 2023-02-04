import { React } from "react";
import { useLocation } from "react-router-dom";

import classes from "./BroadCast.module.scss";
import OvContainer from "../utils/OV/OvContainer";

const BroadCast = () => {
  // const width = window.innerWidth;
  // const height = (width * 9) / 16;
  // const height = window.innerHeight;
  const width = 1280;
  const height = 720;

  const { state } = useLocation();

  return (
    <OvContainer
      width={width}
      height={height}
      sessionId={state.id}
      username={state.username}
      liveInfo={state.liveInfo}
      className={classes.ovContainer}
    />
  );
};

export default BroadCast;
