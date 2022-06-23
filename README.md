<!--
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-19 16:53:25
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-21 21:23:12
-->

# 显示页面实时访问用户

## 上线

进入页面后，等待建立连接，组装 `visitorInfo` 上报 `online` 消息

## 下线

关闭页面前，组装 `visitorInfo` 上报 `offline` 消息

## visitorInfo

主要包含 `pageId` 和 `visitorId`

`pageId` 用来标识当前统计的页面，需全局唯一

`visitorId` 用来标识当前访问的用户，需全局唯一

## 心跳监测

客户端定时向服务端发送心跳包，服务端接收到消息后立即回应，在规定时间内若没有回应则判定为掉线，客户端重新创建连接

ps: 为什么不是服务端向客户端发送心跳包？也可以，只是服务端判定客户端掉线后，没法做重连

## 服务端数据处理

客户端会上报 pageId 和 visitorId 服务端按照

```js
const visitors = {
  pageId1: [visitorId1, visitorId2],
  pageId2: [visitorId1, visitorId3],
};
```

存储

在接收到客户端的 `online` 消息后，立即更新 `visitors` 并广播给所有客户端

在接收到客户端的 `offline` 消息后，立即更新 `visitors` 并广播给所有客户端

## 异常处理

- 客户端断网/异常导致连接断开

心跳监测服务可以处理该情况

- 服务端挂掉/重启

心跳监测服务可以处理该情况

## 参考

[CloseEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code)
