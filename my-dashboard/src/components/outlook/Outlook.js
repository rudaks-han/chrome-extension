import React, {useContext, useEffect, useState} from 'react';
import outlookIcon from '../../static/image/outlook.png';
import {Card} from 'semantic-ui-react'
import UiShare from '../../UiShare';
import RightMenu from "./RightMenu";
import AddLinkLayer from "../share/AddLinkLayer";
import ContentLayer from "./ContentLayer";
const chrome = window.chrome;
//const { ipcRenderer } = window.require('electron');

const Outlook = () => {
    const [list, setList] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        checkLogin();
        if (authenticated) {
            initialize();
        }
    }, [authenticated]);

    const checkLogin = () => {
        setTimeout(() => {
            chrome.runtime.sendMessage({action: "outlookClient.checkLogin"}, response => {
                setAuthenticated(response);
            });
        }, 100)
    }

    const initialize = () => {
        findList();
    }

    const findList = () => {
        setList(null);
        chrome.runtime.sendMessage({action: "outlookClient.findList"}, response => {
            setList(response);
        });

        /*ipcRenderer.send('outlook.findList');
        ipcRenderer.removeAllListeners('outlook.findListCallback');
        ipcRenderer.on('outlook.findListCallback', async (e, data) => {
            setList(data);
            setUnreadCount(data.unreadCount);
        });*/

        /*ipcRenderer.removeAllListeners('outlook.authenticated');
        ipcRenderer.on('outlook.authenticated', async (e, data) => {
            setAuthenticated(data);
        });*/
    }

    const onClickRefresh = () => {
        findList();
    }

    const onClickLogin = () => {
        //ipcRenderer.send('outlook.openLoginPage');
    }

    const onClickLogout = () => {
        //ipcRenderer.send('outlook.logout');
    }

    const openOutlook = () => {
        //ipcRenderer.send('outlook.openOutlook');
    }

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>
                    <div className="ui header">
                        <img src={outlookIcon} alt="" className="header-icon"/>
                        outlook
                    </div>
                    <RightMenu
                        authenticated={authenticated}
                        onClickRefresh={onClickRefresh}
                        onClickLogout={onClickLogout}
                        openOutlook={openOutlook}
                        unreadCount={unreadCount}
                    />
                </Card.Header>
                <ContentLayer
                    authenticated={authenticated}
                    list={list}
                    title="Outlook"
                    icon={outlookIcon}
                    onClickLogin={onClickLogin}
                    openOutlook={openOutlook}
                />
            </Card.Content>
            <Card.Content extra>
                <AddLinkLayer onClick={openOutlook} text="Outlook 열기" />
            </Card.Content>
        </Card>
    )
};

export default Outlook;
