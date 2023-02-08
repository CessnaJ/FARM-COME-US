import React, { useState, useEffect } from "react";
import classes from "./style/MyStoreInfoList.module.scss";

import MyStoreInput from "./MyStoreInput";
import DaumPostcodeEmbed from "react-daum-postcode";

const MyStoreCreateInfoList = (props) => {
  const [openModal, setOpenModal] = useState(false);

  const selectAddress = (data) => {
    props.onStoreInfoChange("streetAddr", data.roadAddress);
    props.onStoreInfoChange("zipcode", data.zonecode);
    setOpenModal(!openModal);
  };

  const validityHandler = () => {};

  const onInputChangeHandler = (e) => {
    const { name, value } = e.target;
    props.onStoreInfoChange(name, value);
  };

  const onEditAddr = () => {
    setOpenModal(!openModal);
  };

  return (
    <ul className={classes.infoList}>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="스토어 이름"
          value={props.info.storeName}
          readOnly={false}
          name="storeName"
          onChange={onInputChangeHandler}
        />
      </li>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="스토어 설명"
          value={props.info.desc}
          readOnly={false}
          name="desc"
          onChange={onInputChangeHandler}
        />
      </li>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="대표 번호"
          value={props.info.pno}
          readOnly={false}
          name="pno"
          onChange={onInputChangeHandler}
        />
      </li>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="기본 배송비"
          value={props.info.deliveryCost}
          readOnly={false}
          name="deliveryCost"
          onChange={onInputChangeHandler}
        />
      </li>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="배송비 미발생 최소 금액"
          value={props.info.deliveryFree}
          readOnly={false}
          name="deliveryFree"
          onChange={onInputChangeHandler}
        />
      </li>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="농장 주소"
          value={props.info.streetAddr}
          readOnly={true}
          onChange={onInputChangeHandler}
          name="streetAddr"
          onClick={onEditAddr}
        />
      </li>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="우편번호"
          value={props.info.zipcode}
          readOnly={true}
          onChange={onInputChangeHandler}
          name="zipcode"
        />
      </li>
      <li className={classes.infoItem}>
        <MyStoreInput
          label="상세주소"
          value={props.info.detailAddr}
          readOnly={false}
          onChange={onInputChangeHandler}
          name="detailAddr"
        />
      </li>
      {openModal && (
        <div className={`${classes.modal} ${classes.openModal}`}>
          <DaumPostcodeEmbed
            onComplete={selectAddress} // 값을 선택할 경우 실행되는 이벤트
            autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
            defaultQuery="동서대로 98-39" // 팝업을 열때 기본적으로 입력되는 검색어. 대전캠주소 해놨음.
          />
        </div>
      )}
      {openModal && (
        <div
          className={classes.backdrop}
          onClick={() => {
            setOpenModal(false);
          }}
        />
      )}
    </ul>
  );
};

export default MyStoreCreateInfoList;
