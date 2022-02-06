import LoginClient from './js/component/loginClient.js';
import JiraClient from './js/component/jiraClient.js';
import DaouofficeClient from './js/component/daouofficeClient.js';
import OutlookClient from './js/component/outlookClient.js';
import JenkinsClient from './js/component/jenkinsClient.js';
import SonarqubeClient from './js/component/sonarqubeClient.js';
import VictoryPortalClient from './js/component/victoryPortalClient.js';

const loginClient = new LoginClient();
const jiraClient = new JiraClient();
const daouofficeClient = new DaouofficeClient();
const outlookClient = new OutlookClient();
const jenkinsClient = new JenkinsClient();
const sonarqubeClient = new SonarqubeClient();
const victoryPortalClient = new VictoryPortalClient();

const receiveMessage = (request, sender, sendResponse) => {
    requestFn(request)
        .then((response) => {
            sendResponse(response);
        }
    )

    return true;
}

const requestFn = async (request) => {
    const requestArr = request.action.split('.');
    const requestClass = requestArr[0];
    const requestFn = requestArr[1];
    const params = request.params;

    let response = null;
    switch (requestClass) {
        case 'loginClient':
            response = await loginClient[requestFn].apply(loginClient, [params]);
            break;
        case 'jiraClient':
            response = await jiraClient[requestFn].apply(jiraClient, [params]);
            break;
        case 'daouofficeClient':
            response = await daouofficeClient[requestFn].apply(daouofficeClient, [params]);
            break;
        case 'outlookClient':
            response = await outlookClient[requestFn].apply(outlookClient, [params]);
            break;
        case 'jenkinsClient':
            response = await jenkinsClient[requestFn].apply(jenkinsClient, [params]);
            break;
        case 'sonarqubeClient':
            response = await sonarqubeClient[requestFn].apply(sonarqubeClient, [params]);
            break;
        case 'victoryPortalClient':
            response = await victoryPortalClient[requestFn].apply(victoryPortalClient, [params]);
            break;
        default:
            console.error('request not found');
            console.error(request);
    }

    console.log('---------- request ---------- ')
    console.log('requestClass: ' + requestClass + ', requestFn: ' + requestFn + ', params: ', params)
    console.log('response')
    console.log(response)

    return response;
}

chrome.runtime.onMessage.addListener(receiveMessage);

