import React, {useContext, useEffect, useState} from 'react';
import daouofficeIcon from '../../static/image/daouoffice.ico';
import {Card} from 'semantic-ui-react'
import UiShare from '../../UiShare';
import ExtraButtons from "./ExtraButtons";
import RightMenu from "./RightMenu";
import AddLinkLayer from "../share/AddLinkLayer";
import TitleLayer from "../share/TitleLayer";
import ContentLayer from "./ContentLayer";
const chrome = window.chrome;

const Daouoffice = () => {
    const [list, setList] = useState(null);
    const [calendarList, setCalendarList] = useState(null);
    const [dayoffList, setDayoffList] = useState(null);
    const [myDayoffList, setMyDayoffList] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [useAlarmClock, setUseAlarmClock] = useState({clockIn: false, beforeTime: 5, clockOut: false, afterTime: 0});
    const [clickedSetting, setClickSetting] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        bindListener();
    }, []);

    useEffect(() => {
        checkLogin();
        if (authenticated) {
            initialize();
        }
    }, [authenticated]);

    const initialize = () => {
        findList();
        findUserInfo();
        findCalendar();
        findNotificationCount();
        findStore();
        findDayoffList();
        findMyDayoffList();
    }

    const bindListener = () => {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.action === 'daouofficeClient.login') {
                    setAuthenticated(true);
                } else if (request.action === 'daouofficeClient.logout') {
                    setAuthenticated(false);
                }
            });
    }

    const checkLogin = () => {
        setTimeout(() => {
            chrome.runtime.sendMessage({action: "daouofficeClient.checkLogin"}, response => {
                setAuthenticated(response);
            });
        }, 100)
    }

    const findList = () => {
        setList(null);
        chrome.runtime.sendMessage({action: "daouofficeClient.findList"}, response => {
            setList(response.data);
        });
    }

    const findUserInfo = () => {
        chrome.runtime.sendMessage({action: "daouofficeClient.findUserInfo"}, response => {
            const clockedIn = response.clockInTime ? true: false;
            const clockedOut = response.clockOutTime ? true: false;
            const userId = response.userId;

            setUserInfo({
                ...response,
                clockedIn,
                clockedOut,
                userId,
                username
            });
        });
    }

    const findCalendar = () => {
        chrome.runtime.sendMessage({action: "daouofficeClient.findCalendar"}, response => {
            setCalendarList(response);
        });
    }

    const findNotificationCount = () => {
        chrome.runtime.sendMessage({action: "daouofficeClient.findNotificationCount"}, response => {
            setNotificationCount(response.data);
        });
    }

    const findStore = () => {
        UiShare.findStorage('daouoffice_useAlarmClock', response => {
            if (response === null) {
                return;
            }

            setUsername(response.username || 'anonymous');

            const clockIn = response.clockIn || false;
            const clockOut = response.clockOut || false;
            const beforeTime = response.beforeTime || 5;
            const afterTime = response.afterTime || 0;
            setUseAlarmClock({
                clockIn,
                clockOut,
                beforeTime,
                afterTime
            });
        });
    }

    const findDayoffList = () => {
        setDayoffList(null);
        chrome.runtime.sendMessage({action: "daouofficeClient.findDayoffList"}, response => {
            const dayoffList = response.filter(item => item.type == 'company').map(item => {
                const { id, startTime, endTime, summary, type } = item;
                const startTimeDate = startTime.substring(0, 10);
                const endTimeDate = endTime.substring(0, 10);

                return {
                    id, startTimeDate, endTimeDate, summary
                }
            });

            setDayoffList(dayoffList);
        });
    }

    const findMyDayoffList = () => {
        setMyDayoffList(null);
        chrome.runtime.sendMessage({action: "daouofficeClient.findMyDayoffList"}, response => {
            setMyDayoffList(response);
        });
    }

    const onClickRefresh = () => {
        findList();
        findDayoffList();
    }

    const onClickLogin = () => {
        window.open('https://spectra.daouoffice.com/login');
    }

    const onClockIn = () => {
        chrome.runtime.sendMessage({action: "daouofficeClient.clockIn", params: {userId: userInfo.userId}}, response => {
            const { code, message } = response;
            if (code === '200') {
                UiShare.showNotification('출근이 등록되었습니다.');
                findUserInfo();
            } else {
                UiShare.showNotification(message)
                if (code === '400') {
                    findUserInfo();
                }
            }
        });
    }

    const onClockOut = () => {
        chrome.runtime.sendMessage({action: "daouofficeClient.clockOut", params: {userId: userInfo.userId}}, response => {
            const { code, message } = response;
            if (code === '200') {
                UiShare.showNotification('퇴근이 등록되었습니다.');
                findUserInfo();
            } else {
                UiShare.showNotification(message)
                if (code === '400') {
                    findUserInfo();
                }
            }
        });
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

