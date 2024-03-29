import {Placeholder} from "semantic-ui-react";
/*const os = window.require('os');
const { dialog } = window.require('electron').remote;*/
/*const logger = window.require('electron-log');*/
const chrome = window.chrome;

class UiShare {
    static displayListLoading = () => {
        return <Placeholder>
            <Placeholder.Header image>
                <Placeholder.Line/>
                <Placeholder.Line/>
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line/>
                <Placeholder.Line/>
                <Placeholder.Line/>
                <Placeholder.Line/>
            </Placeholder.Paragraph>
        </Placeholder>
    };

    static showNotification(message, requireInteraction = false) {
        if (Notification && Notification.permission !== "granted") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
        if (Notification && Notification.permission === "granted") {
            let options = {
                type: 'basic',
                iconUrl: '/images/128x128.png',
                title: 'My Dashboard',
                message: message,
                requireInteraction: requireInteraction
            };

            chrome.notifications.create(options);
            chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
                chrome.notifications.clear(notificationId, function() {});
            });
        }
    }

    static timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    static addMinutes(date, min) {
        date.setTime(date.getTime() + min * 60 * 1000);
        return date;
    }

    static addHours(date, hour) {
        date.setTime(date.getTime() + hour * 60 * 60 * 1000);
        return date;
    }

    static getCurrYear() {
        const currDate = new Date();
        return currDate.getFullYear();
    }

    static getCurrMonth() {
        const currDate = new Date();
        let month = currDate.getMonth() + 1;
        if (month < 10)
            month = '0' + month;

        return month;
    }

    static getCurrDay() {
        const currDate = new Date();
        let day = currDate.getDate();
        if (day < 10)
            day = '0' + day;

        return day;
    }

    static getCurrDate() {
        return UiShare.getCurrYear() + '-' + UiShare.getCurrMonth() + '-' + UiShare.getCurrDay();
    }

    static getCurrTime() {
        const currDate = new Date();
        let hour = currDate.getHours();
        if (hour < 10)
            hour = '0' + hour;
        let minute = currDate.getMinutes();
        if (minute < 10)
            minute = '0' + minute;
        let second = currDate.getSeconds();
        if (second < 10)
            second = '0' + second;

        return hour + ':' + minute + ':' + second;
    }

    static getCurrHour() {
        const currDate = new Date();
        let hour = currDate.getHours();
        if (hour < 10)
            hour = '0' + hour;

        return hour;
    }

    static getCurrMinute() {
        const currDate = new Date();
        let minute = currDate.getMinutes();
        if (minute < 10)
            minute = '0' + minute;
        return minute;
    }

    static getCurrSecond() {
        const currDate = new Date();
        let second = currDate.getSeconds();
        if (second < 10)
            second = '0' + second;

        return second;
    }

    static getTimeFormat(time) {
        const arTime = time.split(':');
        return {
            hour: Number(arTime[0]),
            minute: Number(arTime[1]),
            second: Number(arTime[2])
        }
    }

    static getDateTimeFormat(str) {
        const arStr = str.split(' '); // 2021-09-23 08:51:00
        const arDate = arStr[0].split('-');
        const arTime = arStr[1].split(':');
        return {
            year: Number(arDate[0]),
            month: Number(arDate[1]),
            day: Number(arDate[2]),
            hour: Number(arTime[0]),
            minute: Number(arTime[1]),
            second: Number(arTime[2])
        }
    }

    static isWeekend() {
        let currDate = new Date();
        if (currDate.getDay() === 0 || currDate.getDay() === 6) { // 토, 일 제외
            return true;
        } else {
            return false;
        }
    }

    static getClientIp() {
    }

    static saveStorage(data) {
        chrome.runtime.sendMessage({action: "shareClient.setStorage", params: data}, response => {
        });
    }

    static findStorage(key, callback) {
        const params = {
            key: key
        }

        chrome.runtime.sendMessage({action: "shareClient.getStorage", params}, async response => {
            callback(response);
        });
    }
}


export default UiShare;
