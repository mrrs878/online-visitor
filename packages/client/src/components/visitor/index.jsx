/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-19 14:31:58
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-21 10:43:28
 */

import React from "react";
import { Status, useVisitor } from "./use-visitor";
import "./index.css";

const Visitor = () => {
  const [visitors, status] = useVisitor({ pageId: location.pathname });

  console.log('[visitors]', visitors, status);

  return (
    <div className="visitors-c">
      {
        status === Status.OPEN && (
          visitors.map(([visitorId, { userInfo }]) => (
            <div className="visitor-c" key={visitorId}>
              {userInfo.name}
            </div>
          ))
        )
      }
      {
        status === Status.CLOSED && (
          <div>掉线</div>
        )
      }
      {
        status === Status.CONNECTING && (
          <div>连接中...</div>
        )
      }
    </div>
  );
};

export { Visitor };
