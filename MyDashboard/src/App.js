import React, {useEffect, useState} from 'react';
import './App.css';
import UserContext from "./UserContext";
import TimerContext from "./TimerContext";
import {MainLayout} from "./layouts/MainLayout";
import daouofficeRepository from "./components/daouoffice/repository/DaouofficeRepository";

//const { ipcRenderer } = window.require('electron');
//const firebaseApp = new FirebaseApp();

function App() {
    const [userInfo, setUserInfo] = useState({});
    const [tickTime, setTickTime] = useState(null);

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        startTimer();
    }, []);

    const getUserInfo = () => {
        console.error('getUserInfo')
        daouofficeRepository.findUserInfo();
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

    const startTimer = () => {
        /*ipcRenderer.on('mainWindow.polling', (e, data) => {
            setTickTime(data);
        })*/
    }

    return (
        <UserContext.Provider value={userInfo}>
            <TimerContext.Provider value={tickTime}>
                <MainLayout />
            </TimerContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
