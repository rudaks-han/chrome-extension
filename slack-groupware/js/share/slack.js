class Slack {
	send(channel, message) {
		const authToken = 'xoxb-471569414946-1939462143793-PSSWliJ76qHbSkEuGDdNgGjL';

		const headers = {
			"Authorization": "Bearer " + authToken,
			"Content-Type" : "application/json"
		}

		const body = {
			channel: channel, // Slack user or channel, where you want to send the message
			text: message
		}

		const options = {
			method: 'post',
			url: 'https://slack.com/api/chat.postMessage',
			headers: headers,
			param: JSON.stringify(body),
			success : (res) => {
				console.log('success');
				console.log(res)
			},
			error : (xhr, e) => {
				console.error('error');
				console.error(e);
			},
		};

		requestAjax(options);
	}
}

const slack = new Slack();
