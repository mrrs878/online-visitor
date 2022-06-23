/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-19 14:20:29
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-21 09:59:08
 */

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/header/index";
import { Visitor } from "./components/visitor";

const Home = () => {
  
  const [state, setState] = useState('');
  
  return (
    <div>
      Home
      { state }
      <button onClick={() => setState(Date.now())}>click me</button>
      <Visitor />
    </div>
  )  
};

const Profile = () => (
  <div>
    profile
    <Visitor />
  </div>
);

const App = () => (
  <div>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
  </div>
);

const root = createRoot(document.querySelector("#app"));

root.render(<App />);
