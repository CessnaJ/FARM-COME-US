import React, { Fragment } from "react";

import classes from "./style/MyStoreLiveList.module.scss";

import MyStoreLiveItem from "./MyStoreLiveItem";

const MyStoreLiveList = (props) => {
  const content =
    !props.lives || props.lives.length === 0 ? (
      <div className={classes.noData}>등록된 Live가 없습니다.</div>
    ) : (
      <ul className={classes.liveList}>
        {props.lives.map((live, idx) => (
          <li key={idx}>
            <MyStoreLiveItem item={live} />
          </li>
        ))}
      </ul>
    );
  return <Fragment>{content}</Fragment>;
};

export default MyStoreLiveList;
