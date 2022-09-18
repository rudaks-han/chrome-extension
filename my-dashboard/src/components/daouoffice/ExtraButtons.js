import React from 'react';
import {Button, Dropdown, Popup} from 'semantic-ui-react'

const ExtraButtons = props => {
    if (props.authenticated && props.userInfo) {
        return <div style={{"marginBottom":"5px"}}>
            <Button.Group>
                <Popup
                    content={props.userInfo.clockInTime}
                    open={!!props.userInfo.clockedIn}
                    trigger={<Button onClick={props.onClockIn} disabled={!!props.userInfo.clockedIn}>출근하기</Button>}
                />
                <Button.Or />
                <Popup
                    content={props.userInfo.clockOutTime}
                    open={!!props.userInfo.clockedOut}
                    trigger={<Button onClick={props.onClockOut} positive disabled={!!props.userInfo.clockedOut}>퇴근하기</Button>}
                />
            </Button.Group>
            &nbsp;
            <Dropdown text='바로가기' pointing className='button icon'>
                <Dropdown.Menu>
                    <Dropdown.Item href='https://spectra.daouoffice.com/app/asset' target="_blank">회의실 예약</Dropdown.Item>
                    <Dropdown.Item href='https://spectra.daouoffice.com/app/contact/dept/2752' target="_blank">주소록</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href='https://spectra.daouoffice.com/app/approval/document/new/2752/188949' target="_blank">시차출퇴근 근무 신청서</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href='https://spectra.daouoffice.com/app/approval/document/new/2752/194661' target="_blank">연차 신청서</Dropdown.Item>
                    <Dropdown.Item href='https://spectra.daouoffice.com/app/approval/document/new/2752/199820' target="_blank">비용 신청서</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    } else {
        return null;
    }
};

export default ExtraButtons;
