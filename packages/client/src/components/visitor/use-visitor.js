/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-19 16:27:46
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-21 10:50:52
 */

import { useEffect, useRef, useState } from "react";
import fg from "@fingerprintjs/fingerprintjs";

const Status = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 3,
};

const getUserInfo = () => {
  const params = new URL(document.location).searchParams;
  const name = params.get("name");

  return {
    name,
  };
};

async function getVisitorId() {
  const instance = await fg.load();
  const { visitorId } = await instance.get();
  return visitorId;
}

const useVisitor = ({ pageId }) => {
  const [visitorInfo, setVisitorInfo] = useState({});
  const [visitors, setVisitors] = useState([]);
  const wsClient = useRef();
  const [status, setStatus] = useState(Status.CONNECTING);

  useEffect(() => {
    getVisitorId().then((visitorId) => {
      const userInfo = getUserInfo();
      const _visitorInfo = {
        visitorId,
        pageId,
        userInfo,
      };
      setVisitorInfo(_visitorInfo);
    });
  }, []);

  const offline = (needReconnect = false) => {
    if (
      wsClient.current?.readyState === WebSocket.OPEN &&
      visitorInfo?.visitorId
    ) {
      console.log('[WebSocket Offline]', needReconnect);
      wsClient.current.send(
        JSON.stringify({ type: "offline", data: visitorInfo })
      );
      wsClient.current.close(needReconnect ? 4000 : 1000, "Bye");
    }
  };

  useEffect(() => {
    console.log("visitorInfo", visitorInfo, wsClient.current?.readyState);

    const initWebSocket = () => {
      let tid = null;
      let times = 0;

      const doConnect = (isInit) => {
        clearTimeout(tid);

        tid = setTimeout(() => {
          console.log("[WebSocket Reconnect]", times);
          let client = new WebSocket("ws://localhost:3000");
          client.addEventListener("open", () => {
            wsClient.current = client;
            setStatus(WebSocket.OPEN);
            client?.send?.(
              JSON.stringify({ type: "online", data: visitorInfo })
            );
            clearTimeout(tid);
            tid = null;
          });
          client.addEventListener("error", (e) => {
            console.log("[WebSocket Reconnect Error]", e);
            if (times >= 5) {
              console.log("[WebSocket Reconnect Timeout]");
              tid = null;
              return;
            }
            times += 1;
            doConnect(false);
          });
          client.addEventListener("close", (e) => {
            console.log("[WebSocket Close]", e.code, e.reason);
            /**
             * 正常关闭不需要重连
             */
            if (e.code === 1000) {
              setStatus(Status.CLOSED);
              return;
            }
            setStatus(Status.CONNECTING);
            doConnect(false);
          });

          client.addEventListener("message", (message) => {
            console.log("[WebSocket Message]", message);
            const { type, data: visitors } = JSON.parse(message.data);
            if (type === "visit") {
              setVisitors(visitors);
            }
          });
        }, isInit ? 0 : 1000 << times);
      };

      doConnect(true);
    };

    if (!wsClient.current && visitorInfo.visitorId) {
      initWebSocket(true);
    }

    return offline;
  }, [visitorInfo]);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      if (
        wsClient.current?.readyState === WebSocket.OPEN &&
        visitorInfo?.visitorId
      ) {
        wsClient.current.send(
          JSON.stringify({ type: "offline", data: visitorInfo })
        );
      }
    });
  }, [visitorInfo]);

  return [visitors, status, offline];
};

export { useVisitor, Status };
