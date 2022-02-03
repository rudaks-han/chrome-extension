
export default class JiraClient {
    constructor() {}

    axiosConfig() {
        return {
            headers: {
                //cookie: 'ajs_anonymous_id=%224d52d3f6-a93f-4906-86fc-19b6238103d5%22; ajs_group_id=null; navigation_modules_ui_state={%22classic%22:{%22planning%22:{%22isCollapsed%22:false}%2C%22development%22:{%22isCollapsed%22:false}%2C%22operations%22:{%22isCollapsed%22:false}}%2C%22nextGen%22:{%22planning%22:{%22isCollapsed%22:false}%2C%22development%22:{%22isCollapsed%22:false}%2C%22operations%22:{%22isCollapsed%22:false}}}; _csrf=TqihFJG1r5oP53WMHrRpQe_w; cloud.session.token=eyJraWQiOiJzZXNzaW9uLXNlcnZpY2VcL3Byb2QtMTU5Mjg1ODM5NCIsImFsZyI6IlJTMjU2In0.eyJhc3NvY2lhdGlvbnMiOlt7ImFhSWQiOiI1NTcwNTg6MWE1OTdhZGMtM2VkZC00YjI3LWIzOGQtMWUzMTY3MmRhOGViIiwic2Vzc2lvbklkIjoiNTBkMjU1ZWMtZGU5Ny00MjJkLThhOTUtZmY1YzY1NGIxNzM2IiwiZW1haWwiOiJydWRha3M5NEBnbWFpbC5jb20ifV0sInN1YiI6IjVkNmRkYzE4YzcwMDJkMGQ5ZGMyOWIwZiIsImVtYWlsRG9tYWluIjoic3BlY3RyYS5jby5rciIsImltcGVyc29uYXRpb24iOltdLCJjcmVhdGVkIjoxNjQzODY1MTYzLCJyZWZyZXNoVGltZW91dCI6MTY0Mzg2NTc2MywidmVyaWZpZWQiOnRydWUsImlzcyI6InNlc3Npb24tc2VydmljZSIsInNlc3Npb25JZCI6ImEzNGRkZTgzLTZlMmQtNGU2ZC1hNDBkLTZhNDRmNmFhZGJjMCIsImF1ZCI6ImF0bGFzc2lhbiIsIm5iZiI6MTY0Mzg2NTE2MywiZXhwIjoxNjQ2NDU3MTYzLCJpYXQiOjE2NDM4NjUxNjMsImVtYWlsIjoia21oYW5Ac3BlY3RyYS5jby5rciIsImp0aSI6ImEzNGRkZTgzLTZlMmQtNGU2ZC1hNDBkLTZhNDRmNmFhZGJjMCJ9.QOryrlSGuXbvCiILrev4b30xytp6iO1LbzFVC_1B2bFNHxIRSALr_DEclh7lfZIQ0coPX_qN63oQJdQU7tTGIdV1zXTBgG2_c2szlJAGl7VY307igoc9QKJOx9tTeWQdDFzaJdfMvhsOCcqIFuT0Fr6jH7B40cl4hUKF07hLfJpbMEixwITU6KokSpHo2-QPB7b7570STYQy6Ay4dpdq1t9DuimkSuWljtQA4aIMnMe4-Cbsmnbpe9WbBqTIIYkI7Ykns5CxXy18gYFjPexVoBppauIVMbs9_IjcPIowOMJOOQ0rCl_wqQYrLreC9mQSq2vHTYLh9lf6az7gwdg7mw; atlassian.xsrf.token=77c4dafe-c872-4384-aa70-2f04e703e5bb_19948baa6ecfbe9652ef809ef7ab98b1087a1ec3_lin; JSESSIONID=asES5MvNwjLUwVM7ndtzcr44dkXi4jqsZ7-qoYq9'
            },

        };
    }

    async checkLogin() {
        try {
            return await axios.get('https://enomix.atlassian.net/gateway/api/me')
                .then(response => {
                    return response.status === 200;
                });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async findRecentJobList() {
        const _this = this;
        const count = 10;
        const data = {"operationName":"jira_NavigationActivity","query":"\nfragment NavigationActivityItem on ActivitiesItem {\n  id\n  timestamp\n  object {\n    id\n    name\n    localResourceId\n    type\n    url\n    iconUrl\n    containers {\n      name\n      type\n    }\n    extension {\n      ... on ActivitiesJiraIssue {\n        issueKey\n      }\n    }\n  }\n}\n\nquery jira_NavigationActivity($first: Int, $cloudID: ID!) {\n  activities {\n    myActivities {\n      workedOn(first: $first, filters: [{type: AND, arguments: {cloudIds: [$cloudID], products: [JIRA, JIRA_BUSINESS, JIRA_SOFTWARE, JIRA_OPS]}}]) {\n        nodes {\n          ...NavigationActivityItem\n        }\n      }\n    }\n  }\n}\n\n","variables":{"first":count,"cloudID":"431d1acd-ee73-4c56-b41f-d9cfeb440064"}};

        return await axios.post(`https://enomix.atlassian.net/gateway/api/graphql`, data, _this.axiosConfig())
            .then(response => {
                console.error('jira response')
                console.error(response)
                let items = [];
                response.data.data.activities.myActivities.workedOn.nodes.map(node => {
                    const id = node.id;
                    const issueKey = node.object.extension.issueKey;
                    const containerName = node.object.containers[1].name
                    const timestamp = node.timestamp;
                    const name = node.object.name;
                    const type = node.object.type;
                    const url = node.object.url;
                    const iconUrl = node.object.iconUrl;

                    items.push({
                        id,
                        issueKey,
                        containerName,
                        timestamp,
                        name,
                        type,
                        url,
                        iconUrl
                    })
                });

                return items;
            });
    }
}
