import React from "react";

import classes from "./style/LiveList.module.scss";

import LiveItem from "./LiveItem";
import ReservedLiveItem from "./ReservedLiveItem";

const LivePreviewList = (props) => {
  let list = <span>등록된 라이브가 없습니다.</span>;

  if (props.liveList && props.liveList.length > 0) {
    list = props.isLive
      ? props.liveList.map((item) => <LiveItem key={item.liveId} live={item} />)
      : props.liveList.map((item) => (
          <ReservedLiveItem key={item.liveId} live={item} />
        ));
  }

  return (
    <ul
      className={`${classes.liveList} ${
        props.isPreview ? classes.preview : null
      }`}
    >
      {list}
    </ul>
  );
};

export default LivePreviewList;
