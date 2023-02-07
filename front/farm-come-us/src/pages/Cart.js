import React from "react";
import classes from "./style/Cart.module.scss";
import CartHeader from "../components/cart/CartHeader";
import CartList from "../components/cart/CartList";
import CartFooter from "../components/cart/CartFooter";
import CartSubHeader from "../components/cart/CartSubHeader";

/*
const DUMMY_CART_LIST = [
  {
    storeId: 1,
    storeName: "애플 인 더 청송",
    productId: 1,
    productName: "사과 1박스",
    productOption: 3,
    price: 60000,
    discount: 20,
    discountPrice: 48000,
  },
  {
    storeId: 1,
    storeName: "애플 인 더 청송",
    productId: 2,
    productName: "애플망고 1박스",
    productOption: 1,
    price: 30000,
    discount: 20,
    discountPrice: 24000,
  },
  {
    storeId: 2,
    storeName: "페어 인 더 청송",
    productId: 3,
    productName: "배 1박스",
    productOption: 1,
    price: 20000,
    discount: 20,
    discountPrice: 16000,
  },
  {
    storeId: 3,
    storeName: "퍼시먼 인 더 청송",
    productId: 4,
    productName: "감 1박스",
    productOption: 1,
    price: 20000,
    discount: 20,
    discountPrice: 16000,
  },
];
*/

const Cart = () => {
  return (
    <div className={classes.container}>
      <CartHeader></CartHeader>
      <CartSubHeader></CartSubHeader>
      <CartList></CartList>
      <CartFooter></CartFooter>
    </div>
  );
};

export default Cart;
