
export default class JiraClient {
    constructor() {}

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    async checkLogin() {
        try {
            return await fetch('https://enomix.atlassian.net/gateway/api/me')
                .then(response => response.json())
                .then(response => {
                    return typeof response.account_id !== 'undefined';
                });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async findRecentJobList() {
        const _this = this;
        const data = {"groups":[{"types":["boards","dashboards","projects","filters","issues"],"limit":20}]};
        const options = {
            method: 'POST',
            headers: _this.requestOptions().headers,
            body: JSON.stringify(data)
        };

        return await fetch(`https://enomix.atlassian.net/rest/internal/2/productsearch/singleRecentList`, options)
            .then(response => response.json())
            .then(response => response[0].items);
    }

    async findAssignToMeList() {
        const _this = this;
        const data = {"operationName":"navigationAssignedIssuesQuery","query":"query navigationAssignedIssuesQuery($first: Int!, $jql: String, $useIssueService: Boolean!) {\n    issues(first: $first, jql: $jql, useIssueService: $useIssueService) {\n      edges {\n        node {\n          issueId\n          issuekey {\n            stringValue\n          }\n          summary {\n            textValue\n          }\n          project {\n            id\n            name\n          }\n          status {\n            statusCategoryId\n            name\n          }\n          issuetype {\n            id\n            name\n            iconUrl\n          }\n        }\n      }\n      totalCount\n    }\n  }","variables":{"first":20,"jql":"assignee = currentUser() AND statusCategory != 3 ORDER BY statusCategory DESC, updatedDate DESC","useIssueService":true}}
        const options = {
            method: 'POST',
            headers: _this.requestOptions().headers,
            body: JSON.stringify(data)
        };

        return await fetch(`https://enomix.atlassian.net/rest/gira/1/`, options)
            .then(response => response.json())
            .then(response => {
                let items = [];
                response.data.issues.edges.map(item => {
                    const issueId = item.node.issueId;
                    const issueKey = item.node.issuekey;
                    const issueType = item.node.issuetype;
                    const project = item.node.project;
                    const status = item.node.status;
                    const summary = item.node.summary;

                    items.push({
                        issueId,
                        issueKey,
                        issueType,
                        project,
                        status,
                        summary
                    })
                });

                return items;
            });
    }

    async findRecentProjectList() {
        return await fetch(`https://enomix.atlassian.net/rest/internal/2/productsearch/search?counts=projects%3D5&type=projects`)
            .then(response => response.json())
            .then(response => response[0].items);
    }
}
