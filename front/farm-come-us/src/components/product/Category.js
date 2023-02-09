import React from "react";
import CategoryItem from "./CategoryItem";
import classes from "./style/Category.module.scss";

const Category = (props) => {
  const sendId = (category_id, sub_category_id) => {
    props.getCategoryId(category_id);
    props.getSubCategoryId(sub_category_id);
  };

  let list = props.list.map((item) => (
    <CategoryItem
      category_name={item.category_name}
      category_id={item.category_id}
      key={item.category_id}
      getid={sendId}
    ></CategoryItem>
  ));

  return (
    <div>
      <div className={classes.container}>{list}</div>
    </div>
  );
};

export default Category;
