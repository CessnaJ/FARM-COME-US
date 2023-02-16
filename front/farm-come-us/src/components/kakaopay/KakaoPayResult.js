import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./KakaoPayResult.module.scss";

const KakaoPayResult = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userSlice);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const pgToken = new URL(window.location.href).searchParams.get("pg_token");
  // const tid = sessionStorage.getItem("tid");
  // const partner_order_id = sessionStorage.getItem("orderId");

  const postCompleted = useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + "/api/v1/pay/kakao/success", {
        params: { pg_token: pgToken },
      })
      .then((response) => {
        console.log(response);
        if ((response.status === 100) | 200) {
          alert("결제가 완료되었습니다.");
          // navigate("/");
          setTimeout(navigate("/"), 3000);
        }
      })
      .catch((error) => {
        // 예외처리 추가 예정
        console.log(error);
      });
  }, []);

  return (
    <div className={classes.screen}>
      결제가 완료 후, 메인 페이지로 이동합니다.
    </div>
  );
};
export default KakaoPayResult;
