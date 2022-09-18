import React, {useContext, useEffect, useState} from 'react';
import jenkinsIcon from '../../static/image/jenkins.png';
import {Card} from 'semantic-ui-react'
import UiShare from '../../UiShare';
import TimerContext from "../../TimerContext";
import RightMenu from "./RightMenu";
import AddLinkLayer from "../share/AddLinkLayer";
import TitleLayer from "../share/TitleLayer";
import ContentLayer from "./ContentLayer";
const chrome = window.chrome;

const Jenkins = () => {
    const [list, setList] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [useAlarmOnError, setUseAlarmOnError] = useState(false);
    const [checkedModuleNameList, setCheckedModuleNameList] = useState([]);
    const [jobList, setJobList] = useState([]);
    const [clickedSetting, setClickSetting] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');
    let buildErrorMessage;

    useEffect(() => {
        bindListener();
    }, []);

    useEffect(() => {
        checkLogin();
        if (authenticated) {
            initialize();
        }
    }, [authenticated]);

    const bindListener = () => {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.action === 'jenkinsClient.login') {
                    setAuthenticated(true);
                } else if (request.action === 'jenkinsClient.logout') {
                    setAuthenticated(false);
                }
            });
    }

    const checkLogin = () => {
        setTimeout(() => {
            chrome.runtime.sendMessage({action: "jenkinsClient.checkLogin"}, response => {
                setAuthenticated(response);
            });
        }, 100)
    }

    const initialize = () => {
        findList();
        findModuleList();
        //findUseAlarmOnError();
    }

    const findList = async () => {
        setList(null);
        chrome.runtime.sendMessage({action: "jenkinsClient.findList"}, response => {
            setList(response);
            setLastUpdated(UiShare.getCurrDate() + " " + UiShare.getCurrTime());
        });
    }

    const findModuleList = () => {
        chrome.runtime.sendMessage({action: "jenkinsClient.findModuleList"}, response => {
            const filteredJobs = response.filteredJobs;
            const availableModules = response.availableModules;
            const jobList = filterJobs(filteredJobs);
            const checkedModuleNames = availableModules && availableModules.map(module => module.name) || [];

            setCheckedModuleNameList(checkedModuleNames);
            setJobList(jobList);
        });
    }

    const findUseAlarmOnError = () => {
        chrome.runtime.sendMessage({action: "jenkinsClient.findUseAlarmOnError"}, response => {
            setUseAlarmOnError(response);
        });
    }

    const filterJobs = (jobs) => {
        return jobs.filter(job => {
            if (job._class === 'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject') {
                if (job.name.startsWith('core-asset-')) {
                    return job;
                } else if (job.name.startsWith('talk-api-')) {
                    return job;
                }
            }

            return null;
        });
    }

    const setBuildErrorMessage = msg => {
        buildErrorMessage = msg;
    }

    const onClickSetting = e => {
        if (clickedSetting) {
            setClickSetting(false);
        } else {
            setClickSetting(true);
        }
    }

    const onChangeUseAlarm = (e, data) => {
        const { checked } = data;
        setUseAlarmOnError(checked);
        //ipcRenderer.send('jenkins.useAlarmOnError', checked);
    }

    const onChangeModuleChange = (e, data) => {
        console.error('onChangeModuleChange data')
        console.error(data)
        const { name, value, checked } = data; // value: branch
        const params = {name, value};

        if (checked) {
            chrome.runtime.sendMessage({action: "jenkinsClient.addAvailableModule", params: params}, response => {
                const newModules = [...checkedModuleNameList, name];
                setCheckedModuleNameList(newModules);
                findList();
            });
        } else {
            chrome.runtime.sendMessage({action: "jenkinsClient.removeAvailableModule", params: params}, response => {
                const newModules = checkedModuleNameList.filter(item => item !== name);
                setCheckedModuleNameList(newModules);
                findList();
            });
        }
    }

    const onClickRefresh = () => {
        findList();
    }

    const onClickLogin = () => {
        window.open('http://211.63.24.41:8080/login');
    }

    const onClickLogout = () => {
        //ipcRenderer.send('jenkins.logout');
    }

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>
                    <TitleLayer title="Jenkins" icon={jenkinsIcon} />
                    <RightMenu
                        jobList={jobList}
                        checkedModuleNameList={checkedModuleNameList}
                        authenticated={authenticated}
                        onClickRefresh={onClickRefresh}
                        onClickSetting={onClickSetting}
                        onChangeModuleChange={onChangeModuleChange}
                        onClickLogout={onClickLogout}
                        clickedSetting={clickedSetting}
                        useAlarmOnError={useAlarmOnError}
                        onChangeUseAlarm={onChangeUseAlarm}
                    />
                </Card.Header>
                <ContentLayer
                    authenticated={authenticated}
                    lastUpdated={lastUpdated}
                    list={list}
                    title="Jenkins"
                    icon={jenkinsIcon}
                    setBuildErrorMessage={setBuildErrorMessage}
                    onClickLogin={onClickLogin}
                />
            </Card.Content>
            <Card.Content extra>
                <AddLinkLayer href="http://211.63.24.41:8080/view/victory/" />
            </Card.Content>
        </Card>
    )
};

export default Jenkins;
