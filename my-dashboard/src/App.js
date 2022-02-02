import React, {useEffect, useState} from 'react';
import './App.css';
import UserContext from "./UserContext";
import {MainLayout} from "./layouts/MainLayout";
const chrome = window.chrome;

function App() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = () => {
    console.error('send getUserInfo')
    chrome.runtime.sendMessage({action: "loginClient.findUserInfo"}, response => {
      console.error('____ loginClient.findUserInfo response')
      console.error(JSON.stringify(response));
      setUserInfo(response);
    });

    /*ipcRenderer.send('login.findUserInfo');
    ipcRenderer.on('login.findUserInfoCallback', async (e, data) => {
        const {id, employeeNumber, name, position, deptName} = data;
        setUserInfo(data);
        firebaseApp.updateActiveUserStatus({id, employeeNumber, name, position, deptName});
        firebaseApp.addAccessLog(name);

        return () => {
            ipcRenderer.removeAllListeners('findStoreCallback');
        }
    });

    ipcRenderer.on('login.authenticated', async (e, data) => {
        if (!data) {
            ipcRenderer.send('goLoginPage');
        }
    });*/
  }


  return (
      <UserContext.Provider value={userInfo}>
        <MainLayout />
      </UserContext.Provider>
  );
}

export default App;
