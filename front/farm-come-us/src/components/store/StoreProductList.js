import React from "react";
import classes from "./style/StoreProductList.module.scss";
import StoreProductItem from "./StoreProductItem";

const StoreProductList = (props) => {
  console.log(props);
  let list = <span>등록된 상품이 없습니다.</span>;

  if (props.productList && props.productList.length > 0) {
    list = props.productList.map((item) => (
      <StoreProductItem key={item.itemId} product={item} />
    ));
    return <ul className={classes.productlist}>{list}</ul>;
  }
};

export default StoreProductList;
