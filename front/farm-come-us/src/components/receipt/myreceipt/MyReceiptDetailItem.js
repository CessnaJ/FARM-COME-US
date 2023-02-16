import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import classes from "./style/MyReceiptDetailItem.module.scss";

const MyReceiptDetailItem = (props) => {
  console.log("prop을 보자");
  console.log(props);
  const [imgSrc, setImgSrc] = useState("");
  const [storeName, setStoreName] = useState("");
  const [itemName, setItemName] = useState("");

  const convertedPrice = props.itemPrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  function getImageWithItemID(itemId) {
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + "/api/v1/item", {
        params: { itemId: itemId },
      })
      .then((res) => {
        let imgsrc = res.data.item.savedPath[0];
        let storename = res.data.item.storeName;
        let itemname = res.data.item.itemName;
        console.log(res.data.item);
        console.log(`이미지경로: ${res.data.item.savedPath[0]}`);
        setImgSrc(imgsrc);
        setStoreName(storename);
        setItemName(itemname);
      });
  }

  useEffect(() => {
    getImageWithItemID(props.itemId);
  }, [props.itemId]);

  return (
    <div
      className={classes.receiptItem}
      onClick={() => props.onClick(props.receipt)}
    >
      <div className={classes.receiptImg}>
        <img src={imgSrc} alt="이미지" />
      </div>
      <div className={classes.receiptInfo}>
        <p className={classes.receiptTitle}>{itemName}</p>
        <p className={classes.receiptOrderId}>{storeName}</p>
        <p className={classes.totalPrice}>{`${convertedPrice}원`}</p>
      </div>
    </div>
  );
};

export default MyReceiptDetailItem;
