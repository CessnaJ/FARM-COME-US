import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/common/Button";
import MyPageInput from "../../components/mypage/MyPageInput";
import DaumPostcodeEmbed from "react-daum-postcode";
import classes from "./style/MyPageEdit.module.scss";

const MyPageEdit = (props) => {
  const navigate = useNavigate();

  const header = "";
  const param = "";
  const fetchURL = "backend/userinfo";
  const [userInfo, setUserInfo] = useState("");

  const [nickname, setNickname] = useState("귀여운 양파");
  const [name, setName] = useState("sjkim");
  const [email, setEmail] = useState("foobar@naver.com");

  const [phoneNumber, setPhoneNumber] = useState("010-1234-5678");
  const [roadAddress, setRoadAddress] = useState("기본도로명주소");
  const [specificAddress, setSpecificAddress] =
    useState("상세주소를 입력해주세요.");
  const [zonecode, setZonecode] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const selectAddress = (data) => {
    setRoadAddress(data.roadAddress);
    setZonecode(data.zonecode);
    setOpenModal(!openModal);
  };

  // useEffect로 첫 렌더링시 데이터 가져옴.
  const accessToken = sessionStorage.getItem("accessToken");
  const getUserInfo = useEffect(() => {
    async function fetchData() {
      const res = await axios.get(fetchURL, header, param);
      // 수정필요. 토큰 넣어서 전송해야됨. 그리고, 넣어서 전송해줘야함.
      setUserInfo(res.data);
    }
    fetchData();

    return;
  }, []);
  return (
    <div className={classes.flexbox_col}>
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
      <div className={classes.title}>
        <div>가입정보수정</div>
      </div>
      <hr />
      <div>
        <div className={classes.label} htmlFor="">
          이름
        </div>

        <MyPageInput
          className={classes.input}
          disabled={false}
          placeholder={name}
        />
      </div>
      <div>
        <div className={classes.label} htmlFor="">
          이메일
        </div>

        <MyPageInput
          className={classes.input}
          disabled={false}
          placeholder={email}
        />
      </div>
      <div>
        <div className={classes.label} htmlFor="">
          주소
        </div>

        <MyPageInput
          onFocus={() => {
            setOpenModal(!openModal);
          }}
          onClick={() => {
            setOpenModal(!openModal);
          }}
          className={classes.input}
          disabled={false}
          placeholder={roadAddress}
        />
      </div>
      <div>
        <div className={classes.label} htmlFor="">
          상세 주소
        </div>

        <MyPageInput
          className={classes.input}
          disabled={false}
          placeholder={specificAddress}
        />
      </div>
      <div>
        <div className={classes.label} htmlFor="">
          우편번호
        </div>

        <MyPageInput
          className={classes.input}
          disabled={true}
          placeholder={zonecode}
        />
      </div>
      <div>
        <div className={classes.label} htmlFor="">
          연락처
        </div>

        <MyPageInput
          className={classes.input}
          disabled={false}
          placeholder={phoneNumber}
        />
      </div>
      <Button
        className={classes.button}
        onClick={() => {
          navigate("/mypage/info");
        }}
      >
        수정 완료
      </Button>
    </div>
  );
};

export default MyPageEdit;
