/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-19 14:30:53
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-19 17:36:31
 */

import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

/**
 * @type {React.FC}
 */
const Header = ({ visitors = [] }) => {
  return (
    <div className="header-c">
      <div style={{ flex: 1 }}>
        <Link to={`/${location.search}`}>home</Link>
        &emsp;
        <Link to={`/profile${location.search}`}>profile</Link>
      </div>
    </div>
  );
};

export { Header };
