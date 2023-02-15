import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchStoreProducts } from "../../utils/api/product-http";
import useHttp from "../../hooks/use-http";

import classes from "./style/MyStoreProducts.module.scss";

import MyStoreContentTitle from "../../components/mystore/MyStoreContentTItle";
import MyStoreProductList from "../../components/mystore/MyStoreProductList";

import AddButton from "../../components/mystore/AddButton";
import AddProductModal from "../../components/mystore/AddProductModal";
import Loading from "../../components/common/Loading";

const MyStoreProduct = () => {
  const { storeInfo } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currPage, setCurrPage] = useState(0);

  const {
    sendRequest: getStoreProducts,
    status: spStatus,
    data: storeProductList,
    errorSp,
  } = useHttp(fetchStoreProducts, true);

  useEffect(() => {
    getStoreProducts(storeInfo.storeId, currPage);
  }, [storeInfo, getStoreProducts]);

  /* 기타 메서드 */
  const modalToggleHandler = () => {
    if (!isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }

    setIsModalOpen((prev) => !prev);
  };

  const showProductDetailHandler = (product, event) => {
    console.log(product, event);
    alert("상품 디테일로 넘어가는 이벤트");
  };

  return (
    <div className={classes.pageContainer}>
      <MyStoreContentTitle text="판매상품" />
      {spStatus === "pending" || !storeProductList ? (
        <Loading className={classes.loading} />
      ) : (
        <MyStoreProductList
          products={storeProductList.itemInfoList}
          hasNextPage={storeProductList.hasNextPage}
          onClick={showProductDetailHandler}
        />
      )}

      <div className={classes.btnBox}>
        <AddButton className={classes.btnAdd} onClick={modalToggleHandler} />
      </div>

      {isModalOpen ? (
        <AddProductModal
          title="상품 정보 입력"
          className={isModalOpen ? null : "close"}
          storeInfo={storeInfo}
          onToggleModal={modalToggleHandler}
        />
      ) : null}
    </div>
  );
};

export default MyStoreProduct;
