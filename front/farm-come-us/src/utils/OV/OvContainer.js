import { React, useState, useEffect, Fragment } from "react";
import { OpenVidu } from "openvidu-browser";
import { useNavigate } from "react-router-dom";
import { fetchCloseSession } from "../api/ov-http";
import axios from "axios";

import classes from "./OvContainer.module.scss";
import { TbTruckDelivery } from "react-icons/tb";

import UserVideoComponent from "./UserVideoComponent";
import LiveChat from "../../components/broadcast/LiveChat";
import LiveHeader from "../../components/broadcast/LiveHeader";
import LiveInfo from "../../components/broadcast/LiveInfo";
import LiveFooter from "../../components/broadcast/LiveFooter";
import LeaveButton from "../../components/broadcast/LeaveButton";
import LiveProductInfo from "../../components/broadcast/LiveProductInfo";
import Loading from "../../components/common/Loading";

const OvContainer = (props) => {
  let tempOV = null;
  const navigate = useNavigate();

  const [isPending, setIsPending] = useState(true);
  const [OV, setOV] = useState(null);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [viewerCnt, setViewerCnt] = useState(-1);

  const [isMute, setIsMute] = useState(false);

  // 채팅 관련 state
  const [chatMsg, setChatMsg] = useState("");
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    joinSession();
  }, []);

  useEffect(() => {}, [isPending]);

  useEffect(() => {
    if (!session) return;
    return () => {
      leaveSession();
    };
  }, [session]);

  useEffect(() => {}, [subscribers]);

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager) => {
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      setSubscribers((prev) => {
        return prev.filter((item) => item !== streamManager);
      });
    }
  };

  const joinSession = async () => {
    // --- 1) Get an OpenVidu object ---
    tempOV = new OpenVidu();
    setOV(tempOV);

    // 소켓 통신에서 생기는 여러 로그들을 띄우지 않는 모드
    tempOV.enableProdMode();

    // --- 2) Init a session ---
    const mySession = tempOV.initSession();
    setSession(mySession);

    // --- 3) Specify the actions when events take place in the session ---

    // On every new Stream received...
    mySession.on("streamCreated", (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      const subscriber = mySession.subscribe(event.stream, "publisher");
      setSubscribers(subscriber);

      // Update the state with the new subscribers
      // setSubscribers((prev) => [...prev, subscriber]);
    });

    // On every Stream destroyed...
    mySession.on("streamDestroyed", (event) => {
      // Remove the stream from 'subscribers' array
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("connectionCreated", (event) => {
      setViewerCnt((prev) => prev + 1);
    });

    mySession.on("connectionDestroyed", (event) => {
      setViewerCnt((prev) => prev - 1);
    });

    // On every asynchronous exception...
    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    /* 채팅 이벤트 listener 추가 */
    mySession.on("signal:live-chat", (e) => {
      const sender = JSON.parse(e.from.data).clientData;
      const msg = e.data;
      drawTextList(sender, msg);
    });

    mySession.on("signal:live-close", async (e) => {
      if (!props.isPublisher) {
        alert("진행자에 의해 방송이 종료되었습니다.");
        navigate("/", { replace: true });
      }
    });

    // --- 4) Connect to the session with a valid user token ---
    // Get a token from the OpenVidu deployment
    getToken().then((token) => {
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      mySession
        .connect(token, { clientData: props.username })
        .then(async () => {
          tempOV
            .getUserMedia({
              audioSource: false,
              videoSource: undefined,
              resolution: "1280x720",
              frameRate: 10,
            })
            .then((mediaStream) => {
              var videoTrack = mediaStream.getVideoTracks()[0];

              var newPublisher = tempOV.initPublisher(props.username, {
                audioSource: undefined,
                videoSource: videoTrack,
                publishAudio: props.isPublisher ? true : false,
                publishVideo: true,
                resolution: "1280x720",
                // frameRate: 10,
                insertMode: "APPEND",
                mirror: true,
              });

              // 4-c publish
              mySession.publish(newPublisher);

              setPublisher(newPublisher);
              setCurrentVideoDevice(videoTrack);
              setMainStreamManager(newPublisher);
              setIsPending(false);
            });
        })
        .catch((error) => {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        });
    });
  };

  const getUrlParams = (queryString) => {
    var params = {};

    queryString.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
      params[key] = value;
    });

    return params;
  };

  const leaveSession = async () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    if (session) {
      session.disconnect();
    }

    await setTimeout(() => {
      // Empty all properties...
      setOV(null);
      setSession(undefined);
      setSubscribers([]);
      setMainStreamManager(undefined);
      setPublisher(undefined);
    }, 500);
  };

  const leaveSessionHandler = async () => {
    navigate(-1);
  };

  const closeSessionHandler = async () => {
    if (!window.confirm("방송을 종료하시겠습니까?")) return;

    session
      .signal({
        to: [],
        type: "live-close",
      })
      .catch((err) => {
        console.error(err);
      });
    await setTimeout(() => {}, 2000);

    await fetchCloseSession(props.sessionId);
    await leaveSession();
    navigate("/mystore/live", { replace: true });
  };

  const switchCamera = async () => {
    try {
      OV.getUserMedia({
        audioSource: false,
        videoSource: undefined,
        resolution: "1280x720",
        frameRate: 30,
      }).then(async (mediaStream) => {
        const newVideoTrack = mediaStream
          .getVideoTracks()
          .filter((device) => device.deviceId !== currentVideoDevice.deviceId);

        console.log(mediaStream.getVideoTracks());
        if (newVideoTrack && newVideoTrack.length > 0) {
          const videoTrack = newVideoTrack[0];

          var newPublisher = tempOV.initPublisher(props.username, {
            audioSource: undefined,
            videoSource: videoTrack,
            publishAudio: true,
            publishVideo: true,
            resolution: "1280x720",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: true,
          });
          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);

          setCurrentVideoDevice(videoTrack);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getToken = async () => {
    const mySessionId = await createSession(props.sessionId);
    return await createToken(mySessionId);
  };

  const createSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(
          process.env.REACT_APP_OPENVIDU_SERVER + "/openvidu/api/sessions",
          data,
          {
            headers: {
              Authorization:
                "Basic " +
                btoa("OPENVIDUAPP:" + process.env.REACT_APP_OPENVIDU_SECRET),
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          resolve(res.data.sessionId);
        })
        .catch((err) => {
          if (err.response.status === 409) {
            resolve(sessionId);
          } else {
            alert(err);
          }
        });
    });
  };

  const createToken = async (sessionId) => {
    const myRole = props.isPublisher ? "PUBLISHER" : "SUBSCRIBER";
    const data = { role: myRole };

    const response = await axios.post(
      process.env.REACT_APP_OPENVIDU_SERVER +
        `/openvidu/api/sessions/${sessionId}/connection`,
      data,
      {
        headers: {
          Authorization: `Basic ${btoa(
            `OPENVIDUAPP:${process.env.REACT_APP_OPENVIDU_SECRET}`
          )}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    return response.data.token; // The token
  };

  // 실시간 채팅
  const sendChatMsgHandler = (e) => {
    e.preventDefault();
    if (chatMsg.length === 0) return;

    session
      .signal({
        data: chatMsg,
        to: [],
        type: "live-chat",
      })
      .then(() => {
        setChatMsg("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onTextMsgChangeHandler = (e) => {
    setChatMsg(e.target.value);
  };

  const drawTextList = (sender, msg) => {
    const newChat = { sender: sender, msg: msg };
    setChatList((prev) => [...prev, newChat]);
  };

  const toggleMuteHandler = () => {
    if (isMute) {
      publisher.publishAudio(true);
      publisher.publishVideo(true);
    } else {
      publisher.publishAudio(false);
      publisher.publishVideo(false);
    }

    setIsMute((prev) => !prev);
  };

  return (
    <div className={props.className}>
      {isPending ? (
        <Loading className={classes.loading} />
      ) : (
        <Fragment>
          {session !== undefined && mainStreamManager !== undefined ? (
            <Fragment>
              <div className={classes.ovInfoContainer}>
                <LiveHeader
                  className={classes.liveHeader}
                  isPublisher={props.isPublisher}
                  isMute={isMute}
                  title={props.liveInfo.title}
                  onCameraSwitch={switchCamera}
                  onLiveLeave={leaveSessionHandler}
                  onToggleMute={toggleMuteHandler}
                />
                <LiveInfo
                  subCnt={viewerCnt}
                  title={props.liveInfo.title}
                  stock={props.liveInfo.stock}
                  unit={props.liveInfo.unit}
                />
                <LiveChat
                  chatList={chatList}
                  onTextMsgChangeHandler={onTextMsgChangeHandler}
                  onSubmit={sendChatMsgHandler}
                  msg={chatMsg}
                  isPublisher={props.isPublisher}
                />

                <LiveFooter>
                  {!props.isPublisher ? (
                    <Fragment>
                      <LiveProductInfo liveInfo={props.liveInfo} />
                      <div className={classes.btnBox}>
                        <TbTruckDelivery className={classes.btnPurchase} />
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <LeaveButton onClick={closeSessionHandler} />
                    </Fragment>
                  )}
                </LiveFooter>
              </div>
              {props.isPublisher && (
                <UserVideoComponent
                  className={classes.streamContainer}
                  streamManager={publisher}
                />
              )}
              {!props.isPublisher && (
                <UserVideoComponent
                  className={classes.streamContainer}
                  streamManager={subscribers}
                />
              )}
              {/* {subscribers.map((sub, i) => (
                <div
                  key={i}
                  className={`stream-container ${classes.hiddenVideo}`}
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))} */}
            </Fragment>
          ) : null}
        </Fragment>
      )}
    </div>
  );
};

export default OvContainer;
