import React from "react";
import classes from "./style/StoreProducts.module.scss";
import StoreProductList from "../../components/store/StoreProductList";
import { useLocation } from "react-router-dom";

const ITEM_LIST = [
  {
    liveId: 1,
    productId: 1,
    storeId: 1,
    storeName: "애플 인 더 청송",
    productName: "강원도 고랭지 배추",
    productScript:
      "당도가 진해 특유의 달콤함을 가진 엔비사과를 만나보세요. 🍎 국내에서 정성껏 재배해 신선함이 살아있는 사과만을 담았답니다. 단단한 과육을 아삭하게 한 입 베어 물면 달달한 과즙이 가득 퍼져요. 깨끗하게 씻어 원물 그대로 먹어도 좋고, 샐러드나 샌드위치에 더해 색다른 요리로 즐겨도 만족스러울 거예요.",
    productOption: 1,
    productAmount: 140,
    price: 14000,
    discount: 20,
  },

  {
    liveId: 2,
    productId: 2,
    storeId: 1,
    storeName: "애플 인 더 청송",
    productName: "봉평 메밀 가루",
    productScript:
      "당도가 진해 특유의 달콤함을 가진 엔비사과를 만나보세요. 🍎 국내에서 정성껏 재배해 신선함이 살아있는 사과만을 담았답니다. 단단한 과육을 아삭하게 한 입 베어 물면 달달한 과즙이 가득 퍼져요. 깨끗하게 씻어 원물 그대로 먹어도 좋고, 샐러드나 샌드위치에 더해 색다른 요리로 즐겨도 만족스러울 거예요.",
    productOption: 1,
    productAmount: 20,
    price: 22000,
    discount: 20,
  },

  {
    liveId: 3,
    productId: 3,
    storeId: 2,
    storeName: "페어 인 더 청송",
    productName: "봉평 메밀 가루",
    productScript:
      "당도가 진해 특유의 달콤함을 가진 엔비사과를 만나보세요. 🍎 국내에서 정성껏 재배해 신선함이 살아있는 사과만을 담았답니다. 단단한 과육을 아삭하게 한 입 베어 물면 달달한 과즙이 가득 퍼져요. 깨끗하게 씻어 원물 그대로 먹어도 좋고, 샐러드나 샌드위치에 더해 색다른 요리로 즐겨도 만족스러울 거예요.",
    productOption: 1,
    productAmount: 20,
    price: 25000,
    discount: 20,
  },
  {
    liveId: 4,
    productId: 4,
    storeId: 2,
    storeName: "페어 인 더 청송",
    productName: "봉평 메밀 가루",
    productScript:
      "당도가 진해 특유의 달콤함을 가진 엔비사과를 만나보세요. 🍎 국내에서 정성껏 재배해 신선함이 살아있는 사과만을 담았답니다. 단단한 과육을 아삭하게 한 입 베어 물면 달달한 과즙이 가득 퍼져요. 깨끗하게 씻어 원물 그대로 먹어도 좋고, 샐러드나 샌드위치에 더해 색다른 요리로 즐겨도 만족스러울 거예요.",
    productOption: 1,
    productAmount: 20,
    price: 25000,
    discount: 20,
  },
  {
    liveId: 5,
    productId: 5,
    storeId: 3,
    storeName: "퍼시먼 인 더 청송",
    productName: "봉평 메밀 가루",
    productScript:
      "당도가 진해 특유의 달콤함을 가진 엔비사과를 만나보세요. 🍎 국내에서 정성껏 재배해 신선함이 살아있는 사과만을 담았답니다. 단단한 과육을 아삭하게 한 입 베어 물면 달달한 과즙이 가득 퍼져요. 깨끗하게 씻어 원물 그대로 먹어도 좋고, 샐러드나 샌드위치에 더해 색다른 요리로 즐겨도 만족스러울 거예요.",
    productOption: 1,
    productAmount: 20,
    price: 25000,
    discount: 20,
  },
  {
    liveId: 6,
    productId: 6,
    storeId: 3,
    storeName: "퍼시먼 인 더 청송",
    productName: "봉평 메밀 가루",
    productScript:
      "당도가 진해 특유의 달콤함을 가진 엔비사과를 만나보세요. 🍎 국내에서 정성껏 재배해 신선함이 살아있는 사과만을 담았답니다. 단단한 과육을 아삭하게 한 입 베어 물면 달달한 과즙이 가득 퍼져요. 깨끗하게 씻어 원물 그대로 먹어도 좋고, 샐러드나 샌드위치에 더해 색다른 요리로 즐겨도 만족스러울 거예요.",
    productOption: 1,
    productAmount: 20,
    price: 25000,
    discount: 20,
  },
];

const StoreProducts = () => {
  const location = useLocation();

  const productList = ITEM_LIST.filter(
    (item) => item.storeId === location.state.storeId
  );

  return (
    <div className={classes.container}>
      <StoreProductList productList={productList}></StoreProductList>
    </div>
  );
};

export default StoreProducts;
