import React, { useState, useEffect } from "react";
import Category from "../../components/product/Category.js";
import SubCategory from "../../components/product/SubCategory.js";
import ProductList from "../../components/product/ProductList.js";
import { productList } from "../../utils/api/product-http";

const ITEM_LIST = [
  {
    category_id: 1,
    sub_category_id: 1,
    item_id: 1,
    item_name: "[청송] 무농약 당도 높은 가을 사과, 박스",
    item_description: "",
    item_image: "",
    item_discount: 0,
    item_price: 44800,
    unit: 1,
    store_id: 1,
    store_name: "애플 인 더 청송",
  },
  {
    category_id: 1,
    sub_category_id: 2,
    item_id: 2,
    item_name: "[청송] 무농약 당도 높은 가을 배, 박스",
    item_description: "",
    item_image: "",
    item_discount: 0,
    item_price: 44800,
    unit: 1,
    store_id: 2,
    store_name: "페어 인 더 청송",
  },
  {
    category_id: 2,
    sub_category_id: 1,
    item_id: 3,
    item_name: "[청송] 무농약 당도 높은 가을 감, 박스",
    item_description: "",
    item_image: "",
    item_discount: 0,
    item_price: 44800,
    unit: 1,
    store_id: 3,
    store_name: "퍼시먼 인 더 청송",
  },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categoryNameState, setCategoryName] = useState("전체");
  const [subCategoryNameState, setSubCategoryName] = useState("전체");

  useEffect(() => {
    setProducts(productList());
  }, [setProducts]);

  const getCategoryName = (name) => {
    setCategoryName(name);
    console.log(name);
  };

  const getSubCategoryName = (name) => {
    setSubCategoryName(name);
    console.log(name);
  };

  return (
    <div>
      <Category getCategoryName={getCategoryName} />
      <SubCategory
        categoryName={categoryNameState}
        getSubCategoryName={getSubCategoryName}
      ></SubCategory>
      <ProductList
        ITEM_LIST={ITEM_LIST}
        category_id={categoryNameState}
        sub_category_id={subCategoryNameState}
      />
    </div>
  );
};

export default Products;
