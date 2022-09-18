import React, { useState, useEffect } from 'react';
import { Checkbox } from 'semantic-ui-react'
import UiShare from "../../UiShare";
//const { ipcRenderer } = window.require('electron');
const chrome = window.chrome;

const ModuleList = props => {
    const [checkedModuleNameList, setCheckedModuleNameList] = useState([]);
    const [componentList, setComponentList] = useState([]);

    useEffect(() => {
        findModuleList();
    }, []);

    const findModuleList = () => {
        chrome.runtime.sendMessage({action: "sonarqubeClient.findModuleList"}, response => {
            const components = response.data.components;
            const availableModules = response.availableModules;
            const filteredComponents = filterComponents(components);
            const checkedModuleNames = availableModules.map(module => module.name);
            setCheckedModuleNameList(checkedModuleNames);
            setComponentList(filteredComponents);
        });
    }

    const filterComponents = (components) => {
        return components.filter(component => {
            if (component.name.startsWith('core-asset-')) {
                return component;
            } else if (component.name.startsWith('talk-api-')) {
                return component;
            } else if (component.name.startsWith('talk-ui-')) {
                return component;
            } else {
                return null;
            }
        });
    }

    const onChangeModuleChange = (e, data) => {
        const name = data.name;
        const key = data.value; // key
        const checked = data.checked;
        const params = {name, key};

        if (checked) {
            chrome.runtime.sendMessage({action: "sonarqubeClient.addAvailableModule", params: params}, response => {
                const newModules = [...checkedModuleNameList, name];
                setCheckedModuleNameList(newModules);
                props.findList();
            });

            //ipcRenderer.send('sonarqube.addAvailableModule', {name, key});
            /*const newModules = [...checkedModuleNameList, name];
            setCheckedModuleNameList(newModules);*/
        } else {
            chrome.runtime.sendMessage({action: "sonarqubeClient.removeAvailableModule", params: params}, response => {
                const newModules = checkedModuleNameList.filter(item => item !== name);
                setCheckedModuleNameList(newModules);
                props.findList();
            });

            /*ipcRenderer.send('sonarqube.removeAvailableModule', {name, key});
            const newModules = checkedModuleNameList.filter(item => item !== name);
            setCheckedModuleNameList(newModules);*/
        }
    }

    return (
        componentList.map(item => {
            return <div key={item.key}>
                <Checkbox label={item.name} value={item.key} name={item.name} checked={checkedModuleNameList.includes(item.name)} onChange={onChangeModuleChange} />
            </div>
        })
    )
};

export default ModuleList;
