import axios from "axios";

const DUMMY_SERVER_URL = "https:localhost:3000";
const PRODUCT_API_URL = `${DUMMY_SERVER_URL}/item`;

/* 상품 등록 */
export async function createProduct(productInfo) {
  const formData = new FormData();

  const data = {
    storeId: productInfo.storeId,
    titleCategoryName: productInfo.categoryTitle,
    detailCategoryName: productInfo.categoryDetail,
    itemName: productInfo.itemName,
    itemDescription: productInfo.itemDescription,
    itemPrice: productInfo.itemPrice,
    itemStock: productInfo.itemStock,
    imgSrc: productInfo.imgSrc,
  };
  formData.append("uploadFile", productInfo.uploadFile);

  formData.append(
    "item",
    new Blob([JSON.stringify(data)], {
      type: "application/json",
    })
  );

  console.log(data);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    const response = axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/api/v1/item`,
      formData,
      config
    );

    console.log(response);
  } catch (err) {
    console.err(err);
  }
}

/* 상품 상세 조회 */
export async function productDetail(productId) {
  try {
    const response = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/v1/item`,
      params: {
        itemId: productId,
      },
    });
    const data = response.data;
    console.log(data);
    return data;
  } catch (err) {
    console.err(err);
  }
}

/* 상품 목록 조회 */
export async function productList(category, itemName, subCategory) {
  try {
    console.log(category, subCategory);
    const response = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_SERVER_URL}/api/v1/item/keyword`,
      data: {
        itemSearchReq: {
          detailCategoryName: subCategory,
          itemName: itemName,
          titleCategoryName: category,
        },
        page: 0,
        size: 6,
      },
    });
    const data = response.data;
    console.log(data);
    return data;
  } catch (err) {
    console.err(err);
  }
}

/* 등록 상품 삭제 */
export async function deleteProduct(productId) {
  try {
    const response = axios({
      method: "delete",
      url: PRODUCT_API_URL,
      params: {
        itemId: productId,
      },
    });
    console.log(response.success);
  } catch (err) {
    console.err(err);
  }
}

/* 등록 상품 수정 */
export async function updateProduct(product) {
  try {
    const response = axios({
      method: "put",
    });
    console.log(response.success);
  } catch (err) {
    console.err(err);
  }
}
