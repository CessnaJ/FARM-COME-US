import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PayCancel = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(navigate("/"), 2000);
  }, []);
  return <div>결제 취소</div>;
};

export default PayCancel;