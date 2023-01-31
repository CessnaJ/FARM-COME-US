import "./App.scss";

import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import classes from "./App.scss";

import Header from "./components/common/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import SideMenu from "./components/common/SideMenu";
import Backdrop from "./components/common/Backdrop";
import Products from "./pages/product/Products";
import Live from "./pages/live/Live";
import RunningLive from "./pages/live/RunningLive";
import ScheduledLive from "./pages/live/ScheduledLive";
import NotFound from "./pages/NotFound";
import MyStore from "./pages/mystore/MyStore";
import MyStoreInfo from "./pages/mystore/MyStoreInfo";
import MyStoreLive from "./pages/mystore/MyStoreLive";
import MyStoreProducts from "./pages/mystore/MyStoreProducts";
import MyStoreReceipt from "./pages/mystore/MyStoreReceipt";

const App = () => {
  const menu = useSelector((state) => state.menu.isOpen); // 로그인상태에 따라 화면 재렌더링(유저정보 업데이트)

  return (
    <div id="app">
      <Header />
      <div>
        {menu && <Backdrop />}
        <SideMenu
          className={`${classes.sideMenu} ${
            menu ? classes.open : classes.closed
          }`}
        />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/livestore" element={<Live />}>
          <Route path="running" element={<RunningLive />} />
          <Route path="scheduled" element={<ScheduledLive />} />
          <Route path="" element={<Navigate replace to="running" />} />
        </Route>
        <Route path="/products" element={<Products />} />
        {/* 마이스토어 생성을 안했으면 prompt 창 띄우고 마이페이지로 리다이렉션 */}
        <Route path="/mystore" element={<MyStore />}>
          <Route path="info" element={<MyStoreInfo />} />
          <Route path="live" element={<MyStoreLive />} />
          <Route path="product" element={<MyStoreProducts />} />
          <Route path="receipt" element={<MyStoreReceipt />} />
          <Route path="" element={<Navigate replace to="info" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
