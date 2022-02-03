import React, {useEffect, useState} from 'react';
import './App.css';
import UserContext from "./UserContext";
import {MainLayout} from "./layouts/MainLayout";
const chrome = window.chrome;

function App() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    //getUserInfo();
  }, []);
  const getUserInfo = () => {
    chrome.runtime.sendMessage({action: "loginClient.findUserInfo"}, response => {
      setUserInfo(response);
    });
  }


  return (
      <UserContext.Provider value={userInfo}>
        <MainLayout />
      </UserContext.Provider>
  );
}

export default App;
