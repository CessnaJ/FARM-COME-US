import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import MyPageHeader from "../../components/mypage/MyPageHeader";
import {
  fetchUserInfo,
  fetchUserInfoWithAccessToken,
} from "../../utils/api/user-http";
import { useDispatch } from "react-redux";
import userSlice from "../../reduxStore/userSlice";

const DUMMY_MYPAGE_INFO = {
  id: 1,
  nickname: "홍당홍당",
  name: "홍당무",
  email: "ssafy123@ssafy.com",
  pno: "010-1234-1234",
  storeId: null,
  streetAddr: "강원도 평창군 봉평면 무야리 23-12",
  detailAddr: "강원 아파트",
  zipcode: 34212,
  imgSrc: process.env.PUBLIC_URL + "/img/defaultProfile.png",
};

const MyPage = (props) => {
  const dispatch = useDispatch();
  // 유저정보 관리 변수
  const [userInfo, setUserInfo] = useState({
    ...DUMMY_MYPAGE_INFO,
  });

  const [isEditting, setIsEditting] = useState(false);

  useEffect(() => {
    const testMemberId = 1;
    const userDataRes = fetchUserInfoWithAccessToken();
    // const fetchedInfo = fetchUserInfo(testMemberId);
    // console.log(fetchedInfo);
    console.log(userDataRes);
  }, []);

  const toggleIsEditting = (e) => {
    e.preventDefault();
    setIsEditting((prev) => !prev);
  };

  const editInfoHandler = (e) => {
    e.preventDefault();

    alert("사용자 정보가 수정되었습니다.");
    console.log(userInfo);
    setIsEditting((prev) => !prev);
  };

  const userInfoChangeHandler = (name, value) => {
    setUserInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const cancelInfoEditHandler = () => {
    setUserInfo((prev) => {
      return {
        ...DUMMY_MYPAGE_INFO,
      };
    });

    setIsEditting((prev) => !prev);

    alert("수정이 취소되었습니다.");
  };

  return (
    <div>
      <MyPageHeader profileImg={profileImg} userInfo={DUMMY_MYPAGE_INFO} />
      <Outlet context={{ info: DUMMY_MYPAGE_INFO }} />
    </div>
  );
};

export default MyPage;
