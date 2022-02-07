export default class ShareUtil {
    static getCookie(url, name) {
        return new Promise((resolve, reject) => {
            window.chrome.cookies.get({
                    url: url,
                    name: name
                },
                (cookie) => {
                    if (cookie) {
                        console.log(cookie.value)
                        resolve(cookie.value)
                    }
                    else {
                        console.log('Cannot get cookie! Check the name!')
                        console.log(`url: ${url}, name: ${name}`)
                        reject(0);
                    }
                })
        });
    }

    static getCurrDate() {
        return this.getCurrYear() + '-' + this.getCurrMonth() + '-' + this.getCurrDay();
    }

    static getCurrDateToMonth() {
        return this.getCurrYear() + '-' + this.getCurrMonth();
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

    static addDays(date, days) {
        let d = new Date(date);
        d.setDate(d.getDate() + days);

        const year = d.getFullYear()
        let month = d.getMonth() + 1;
        if (month < 10)
            month = '0' + month;
        let day = d.getDate();
        if (day < 10)
            day = '0' + day;
        return year + '-' + month + '-' + day;
    }

    static printAxiosError(error) {
        const response = error ? error.response : '';
        if (response) {
            const errorData = {
                status: response.status,
                statusText: response.statusText,
                headers: JSON.stringify(response.config.headers),
                cookie: response.config.headers.Cookie,
                url: response.config.url,
                method: response.config.method,
                configData: response.config.data,
                data: response.data && JSON.stringify(response.data)
            }
            console.error('[axios error]', errorData);
        } else {
            console.error('response is undefined', error);
            //console.error(e);
        }
    }

    /*static setStorage() {
        chrome.storage.sync.set(jsonValue, function() {
            logger.debug('Settings saved');
            //logger.debug(JSON.stringify(jsonValue));
            console.log(jsonValue);

            showNotify('설정', '설정정보가 저장되었습니다.');

            const firebaseKey = firebaseApp.user_config + '/' + username;
            //const firebaseValue = {'use-flag' : useFlag};
            delete jsonValue['password'];

            firebaseApp.set(firebaseKey, jsonValue);
        });
    }*/

    static getStorageData = key =>
        new Promise((resolve, reject) =>
            chrome.storage.local.get(key, result =>
                chrome.runtime.lastError
                    ? reject(Error(chrome.runtime.lastError.message))
                    : resolve(result[key])
            )
        );

    static setStorageData = data =>
        new Promise((resolve, reject) =>
            chrome.storage.local.set(data, () =>
                chrome.runtime.lastError
                    ? reject(Error(chrome.runtime.lastError.message))
                    : resolve()
            )
        )

}
