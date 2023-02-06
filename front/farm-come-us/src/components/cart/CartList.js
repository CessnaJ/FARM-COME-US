import React from "react";
import classes from "./style/CartList.module.scss";
import CartCard from "./CartCard";

const DUMMY_CART_LIST = [
  [
    {
      storeId: 1,
      storeName: "애플 인 더 청송",
      productId: 1,
      productName: "사과 1박스",
      productOption: 1,
      productAmount: 2,
      price: 20000,
      discount: 20,
    },
    {
      storeId: 1,
      storeName: "애플 인 더 청송",
      productId: 4,
      productName: "애플망고 1박스",
      productOption: 1,
      productAmount: 2,
      price: 40000,
      discount: 20,
    },
  ],
  [
    {
      storeId: 2,
      storeName: "페어 인 더 청송",
      productId: 2,
      productName: "배 1박스",
      productOption: 1,
      productAmount: 2,
      price: 20000,
      discount: 20,
    },
  ],
  [
    {
      storeId: 3,
      storeName: "퍼시먼 인 더 청송",
      productId: 3,
      productName: "감 1박스",
      productOption: 1,
      productAmount: 2,
      price: 20000,
      discount: 20,
    },
  ],
];

const CartList = () => {
  let list = DUMMY_CART_LIST.map((array, index) => (
    <CartCard key={index} itemList={array}></CartCard>
  ));

  return (
    <div className={classes.container}>
      <div>{list}</div>
    </div>
  );
};

export default CartList;
