import React, {useContext, useEffect, useState} from 'react';
import daouofficeIcon from '../../static/image/daouoffice.ico';
import {Card} from 'semantic-ui-react'
import UiShare from '../../UiShare';
import TimerContext from "../../TimerContext";
import ExtraButtons from "./ExtraButtons";
import RightMenu from "./RightMenu";
import AddLinkLayer from "../share/AddLinkLayer";
import TitleLayer from "../share/TitleLayer";
import ContentLayer from "./ContentLayer";
const chrome = window.chrome;

/*const { ipcRenderer } = window.require('electron');*/
/*const logger = window.require('electron-log').scope('daouoffice');*/

const Daouoffice = () => {
    const [list, setList] = useState(null);
    const [calendarList, setCalendarList] = useState(null);
    const [dayoffList, setDayoffList] = useState(null);
    const [myDayoffList, setMyDayoffList] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [useAlarmClock, setUseAlarmClock] = useState({clockIn: true, beforeTime: 5, clockOut: true, afterTime: 0});
    const [clickedSetting, setClickSetting] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        findList();
        findUserInfo();
        findCalendar();
        findNotificationCount();
        findStore();
        findDayoffList();
        findMyDayoffList();
    }, []);

    useEffect(() => {
        console.log('userInfo : ' + userInfo)
        console.log('authenticated : ' + authenticated)
        setAuthenticated(true);

        //if (!userInfo || !authenticated) return;
    }, [authenticated]);

    const findList = () => {
        setList(null);
        chrome.runtime.sendMessage({action: "daouofficeClient.findList"}, response => {
            setList(response.data);
            setAuthenticated(true);
        });
    }

    const findUserInfo = () => {
        /*ipcRenderer.send('daouoffice.findUserInfo');
        ipcRenderer.on('daouoffice.findUserInfoCallback', async (event, data) => {
            const clockedIn = data.clockInTime ? true: false;
            //const clockedIn = false; // 임시
            const clockedOut = data.clockOutTime ? true: false;

            setUserInfo({
                ...data,
                clockedIn,
                clockedOut
            });

            ipcRenderer.removeAllListeners('daouoffice.findUserInfoCallback');
        });*/
    }

    const findCalendar = () => {
        /*ipcRenderer.send('daouoffice.findCalendar');
        ipcRenderer.removeAllListeners('daouoffice.findCalendarCallback');
        ipcRenderer.on('daouoffice.findCalendarCallback', async (event, data) => {
            setCalendarList(data);
        });*/

    }

    const findNotificationCount = () => {
        /*ipcRenderer.send('daouoffice.findNotificationCount');
        ipcRenderer.on('daouoffice.findNotificationCountCallback', async (event, data) => {
            setNotificationCount(data.data);

            ipcRenderer.removeAllListeners('daouoffice.findNotificationCountCallback');
        });*/
    }

    const findStore = () => {
        /*ipcRenderer.send('daouoffice.findStore');
        ipcRenderer.on('daouoffice.findStoreCallback', async (event, data) => {
            setUsername(data.username);

            const clockIn = data.useAlarmClock.clockIn || false;
            const clockOut = data.useAlarmClock.clockOut || false;
            const beforeTime = data.useAlarmClock.beforeTime || 5;
            const afterTime = data.useAlarmClock.afterTime || 0;
            setUseAlarmClock({
                clockIn,
                clockOut,
                beforeTime,
                afterTime
            });
            ipcRenderer.removeAllListeners('daouoffice.findStoreCallback');
        });*/
    }

    const findDayoffList = () => {
        /*setDayoffList(null);
        ipcRenderer.send('daouoffice.findDayoffList');
        ipcRenderer.on('daouoffice.findDayoffListCallback', async (event, data) => {
            const dayoffList = data.filter(item => item.type == 'company').map(item => {
                const { id, startTime, endTime, summary, type } = item;
                const startTimeDate = startTime.substring(0, 10);
                const endTimeDate = endTime.substring(0, 10);

                return {
                    id, startTimeDate, endTimeDate, summary
                }
            });

            setDayoffList(dayoffList);
            ipcRenderer.removeAllListeners('daouoffice.findDayoffListCallback');
        });*/
    }

    const findMyDayoffList = () => {
        /*setMyDayoffList(null);
        ipcRenderer.send('daouoffice.findMyDayoffList');
        ipcRenderer.on('daouoffice.findMyDayoffListCallback', async (event, data) => {
            setMyDayoffList(data);
            ipcRenderer.removeAllListeners('daouoffice.findMyDayoffListCallback');
        });*/
    }

    const onClickRefresh = () => {
        findList();
        findDayoffList();
    }

    const onClickLogin = () => {
        //ipcRenderer.send('daouoffice.openLoginPage');
    }

    const onClockIn = () => {
        /*ipcRenderer.send('daouoffice.clockIn');
        ipcRenderer.on('daouoffice.clockInCallback', async (event, data) => {
            const { code, message } = data;
            if (code === '200') {
                UiShare.showNotification('출근이 등록되었습니다.');
                findUserInfo();
                /!*setUserInfo({
                    ...userInfo,
                    clockedIn: true,
                    clockInTime: UiShare.getCurrTime()
                });*!/
            } else {
                UiShare.showNotification(message);
                if (code === '400') {
                    findUserInfo();
                    /!*setUserInfo({
                        ...userInfo,
                        clockedIn: true
                    });*!/
                }
            }

            ipcRenderer.removeAllListeners('daouoffice.clockInCallback');
        });*/
    }

    const onClockOut = () => {
       /* ipcRenderer.send('daouoffice.clockOut');
        ipcRenderer.on('daouoffice.clockOutCallback', async (event, data) => {
            const { code, message } = data;
            if (code === '200') {
                UiShare.showNotification('퇴근이 등록되었습니다.');
                findUserInfo();
            } else {
                UiShare.showNotification(message);
                if (code === '400') {
                    findUserInfo();
                }
            }

            ipcRenderer.removeAllListeners('daouoffice.clockOutCallback');
        });*/
    }

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>
                    <TitleLayer title="Daouoffice" icon={daouofficeIcon} />
                    <RightMenu
                        authenticated={authenticated}
                        userInfo={userInfo}
                        clickedSetting={clickedSetting}
                        setClickSetting={setClickSetting}
                        findList={findList}
                        findDayoffList={findDayoffList}
                        notificationCount={notificationCount}
                        useAlarmClock={useAlarmClock}
                        setUseAlarmClock={setUseAlarmClock}
                        onClickRefresh={onClickRefresh}
                    />
                </Card.Header>
                <ContentLayer
                    title="Daouoffice"
                    authenticated={authenticated}
                    list={list}
                    dayoffList={dayoffList}
                    myDayoffList={myDayoffList}
                    onClickLogin={onClickLogin}
                    icon={daouofficeIcon}
                />
            </Card.Content>
            <Card.Content extra>
                <ExtraButtons
                    authenticated={authenticated}
                    userInfo={userInfo}
                    onClockIn={onClockIn}
                    onClockOut={onClockOut}
                />
                <AddLinkLayer href="https://spectra.daouoffice.com/app/hom" />
            </Card.Content>
        </Card>
    )
};

export default Daouoffice;
