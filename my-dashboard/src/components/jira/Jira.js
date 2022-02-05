import React, {useContext, useEffect, useState} from 'react';
import jiraIcon from '../../static/image/icons8-jira-100.png';
import {Card} from 'semantic-ui-react'
import UiShare from '../../UiShare';
import TimerContext from "../../TimerContext";
import RightMenu from "./RightMenu";
import ContentLayer from "./ContentLayer";
import AddLinkLayer from "../share/AddLinkLayer";
import TitleLayer from "../share/TitleLayer";
const chrome = window.chrome;

const Jira = () => {
    const [recentJobList, setRecentJobList] = useState(null);
    const [assignToMeList, setAssignToMeList] = useState(null);
    const [recentProjectList, setRecentProjectList] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkLogin();
        if (authenticated) {
            initialize();
        }
    }, [authenticated]);

    const checkLogin = () => {
        setTimeout(() => {
            chrome.runtime.sendMessage({action: "jiraClient.checkLogin"}, response => {
                setAuthenticated(response);
            });
        }, 100)
    }

    const initialize = () => {
        findRecentJobList();
        findAssignToMeList();
        findRecentProjectList();
    }

    const findRecentJobList = () => {
        setRecentJobList(null);
        chrome.runtime.sendMessage({action: "jiraClient.findRecentJobList"}, response => {
            setRecentJobList(response);
        });
    }

    const findAssignToMeList = () => {
        setAssignToMeList(null);
        chrome.runtime.sendMessage({action: "jiraClient.findAssignToMeList"}, response => {
            setAssignToMeList(response);
        });
    }

    const findRecentProjectList = () => {
        setRecentProjectList(null);
        chrome.runtime.sendMessage({action: "jiraClient.findRecentProjectList"}, response => {
            setRecentProjectList(response);
        });
    }

    const onClickRefresh = () => {
        findRecentJobList();
        findAssignToMeList();
        findRecentProjectList();
    }

    const onClickLogin = () => {
        //ipcRenderer.send('jira.openLoginPage');
    }

    const onClickLogout = () => {
        //ipcRenderer.send('jira.logout');
    }

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>
                    <TitleLayer title="Jira" icon={jiraIcon} />
                    <RightMenu authenticated={authenticated} onClickRefresh={onClickRefresh} onClickLogout={onClickLogout} />
                </Card.Header>
                <ContentLayer
                    authenticated={authenticated}
                    recentJobList={recentJobList}
                    assignToMeList={assignToMeList}
                    recentProjectList={recentProjectList}
                    title="Jira"
                    icon={jiraIcon}
                    onClickLogin={onClickLogin}
                />
            </Card.Content>
            <Card.Content extra>
                <AddLinkLayer href="https://enomix.atlassian.net/jira/your-work" />
            </Card.Content>
        </Card>
    )
};

export default Jira;
