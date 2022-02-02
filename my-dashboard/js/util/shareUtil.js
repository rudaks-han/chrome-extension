class ShareUtil {
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
}