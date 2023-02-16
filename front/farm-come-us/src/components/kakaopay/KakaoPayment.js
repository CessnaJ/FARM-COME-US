import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import classes from "./KakaoPayment.module.scss";

const KakaoPayment = (props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const pgToken = urlParams.get("pg_token");
  console.log(pgToken);

  axios.return(
    <div className={classes.screen}>
      <div>결제 상세</div>
      <div>카카오페이 결제 중입니다.</div>
    </div>
  );
};

export default KakaoPayment;
