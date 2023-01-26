import React from "react";

import classes from "./style/LivePreview.module.scss";

import PreviewHeader from "./PreviewHeader";
import LivePreviewList from "./LivePreviewList";
import { MdOutlineLiveTv } from "react-icons/md";
import { MdOutlineCalendarToday } from "react-icons/md";

// 더미 데이터
const LIVE_LIST = [
  {
    liveId: 1,
    storeId: 1,
    storeName: "강원 고랭 배추",
    productId: 1,
    productName: "강원도 고랭지 배추",
    discount: 14,
    price: 10800,
    unit: 1,
  },
  {
    liveId: 2,
    storeId: 2,
    storeName: "제주 당근당근",
    productId: 2,
    productName: "[서귀포] 신선 당근",
    discount: 12,
    price: 6200,
    unit: 1,
  },
  {
    liveId: 3,
    storeId: 3,
    storeName: "강원 고랭 배추",
    productId: 3,
    productName: "강원도 고랭지 배추",
    discount: 14,
    price: 10800,
    unit: 3,
  },
  {
    liveId: 4,
    storeId: 4,
    storeName: "제주 당근당근",
    productId: 4,
    productName: "[서귀포] 신선 당근",
    discount: 16,
    price: 13200,
    unit: 1,
  },
];

const RESERVED_LIVE_LIST = [
  {
    liveId: 1,
    storeId: 1,
    storeName: "강원 고랭 배추",
    productId: 1,
    productName: "강원도 고랭지 배추",
    discount: 14,
    price: 10800,
    unit: 1,
    time: new Date(),
  },
  {
    liveId: 2,
    storeId: 2,
    storeName: "제주 당근당근",
    productId: 2,
    productName: "[서귀포] 신선 당근",
    discount: 12,
    price: 6200,
    unit: 1,
    time: new Date(),
  },
  {
    liveId: 3,
    storeId: 3,
    storeName: "강원 고랭 배추",
    productId: 3,
    productName: "강원도 고랭지 배추",
    discount: 14,
    price: 10800,
    unit: 3,
    time: new Date(),
  },
  {
    liveId: 4,
    storeId: 4,
    storeName: "제주 당근당근",
    productId: 4,
    productName: "[서귀포] 신선 당근",
    discount: 16,
    price: 13200,
    unit: 1,
    time: new Date(),
  },
];

const LivePreview = () => {
  return (
    <div className={classes.container}>
      {/* 라이브 목록 */}
      <PreviewHeader
        className={`${classes.header} title`}
        text="진행 중인 라이브"
        logo={<MdOutlineLiveTv className={`${classes.logo} ${classes.red}`} />}
      />
      <LivePreviewList liveList={LIVE_LIST} isLive={true} />
      <div className={classes.horzLine} />

      {/* 예정된 라이브 */}
      <PreviewHeader
        className={`${classes.header} title`}
        text="라이브 예정"
        logo={<MdOutlineCalendarToday className={`${classes.logo}`} />}
      />
      <LivePreviewList liveList={RESERVED_LIVE_LIST} isLive={false} />
      <div className={classes.horzLine} />
    </div>
  );
};

export default LivePreview;
