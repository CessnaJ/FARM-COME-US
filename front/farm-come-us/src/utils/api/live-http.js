const DUMMY_SERVER_URL = "https:localhost:3000";
const LIVE_API_URL = `${DUMMY_SERVER_URL}/live`;

const localLiveObjFormatter = (obj) => {
  const parsedObj = JSON.parse(obj);
  return {
    liveId: parsedObj.live_id,
    productId: parsedObj.item_id,
    startTime: parsedObj.live_Start,
    endTime: parsedObj.live_end,
    discount: parsedObj.live_discount,
    storeId: parsedObj.store_id,
  };
};

const serverLiveObjFormatter = (obj) => {
  return JSON.stringify({
    liveId: obj.liveId,
    itemId: obj.productId,
    liveStart: obj.startTime,
    liveEnd: obj.endTime,
    liveDiscount: obj.discount,
    storeId: obj.storeId,
  });
};

/* 라이브 등록 */
export async function addLive(data) {
  try {
    const response = await axios({
      method: "post",
      url: `${LIVE_API_URL}`,
      data: {
        liveInsertReq: serverLiveObjFormatter(data),
      },
    });
    console.log(response.success);
  } catch (err) {
    console.err(err);
  }

  return liveList;
}

/* 라이브 목록 조회 */
export async function getLiveList() {
  const liveList = [];
  try {
    const response = await axios({
      method: "get",
      url: `${LIVE_API_URL}`,
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.err(err);
  }

  return liveList;
}

/* 라이브 상세 조회 */
export async function getLiveDetail(id) {
  try {
    const response = await axios({
      method: "get",
      url: `${LIVE_API_URL}`,
      params: {
        liveId: id,
      },
    });
    const data = response.json();
    console.log(data);
  } catch (err) {
    console.err(err);
  }

  return null;
}

/* 라이브 수정 */
export async function updateLive(liveInfo) {
  try {
    const response = await axios({
      method: "put",
      url: `${LIVE_API_URL}`,
      data: {
        liveInsertReq: serverLiveObjFormatter(liveInfo),
      },
    });
    console.log(resposne.success);
  } catch (err) {
    console.err(err);
  }
}

/* 라이브 삭제 */
export async function deleteLive(id) {
  try {
    const response = await axios({
      method: "delete",
      url: `${LIVE_API_URL}`,
      params: {
        liveId: id,
      },
    });
    console.log(response.success);
  } catch (err) {
    console.err(err);
  }
}
