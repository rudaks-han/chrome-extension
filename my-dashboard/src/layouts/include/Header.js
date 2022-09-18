import React, {useContext} from 'react';
import {Button, Menu} from 'semantic-ui-react'
import UserContext from '../../UserContext';
import UiShare from "../../UiShare";
const chrome = window.chrome;

function Header() {
    const userInfo = useContext(UserContext);

    const onClickSettingReset = () => {
        chrome.runtime.sendMessage({action: "shareClient.clearStorage"}, response => {
            UiShare.showNotification('설정정보가 초기화되었습니다.');
            document.location.reload();
        });
    }

    return (
        <Menu size='tiny'>
            <Menu.Item
                name='My Dashboard'
            />

            <Menu.Menu position='right'>
                <Menu.Item>
                    {userInfo.name} 님
                </Menu.Item>
                <Menu.Item>
                    <Button onClick={onClickSettingReset}>설정 초기화</Button>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;
