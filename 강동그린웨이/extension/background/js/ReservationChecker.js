import HttpRequest from "./lib/httpRequest.js";

export default class ReservationChecker {

	constructor() {
	}

	check = async () => {
		const options = {
			method: 'POST',
			headers:  {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Cookie': 'JSESSIONID=A8B18279047434BB126F8F6C256CCB7D; AWSELB=E1097DC250F55F1D098D8FCEFABB9ACBD419325508561DBA8A3A5FAFB95670BEA499F6804003A02C9D79D7B2D6E6CB9611D1A190DE49BB824CC7F1CA0B2B04E934A56F178BE8DAB97A91FD00C82B6090D6976160; _ga=GA1.2.1758326246.1663497118; _gid=GA1.2.284800603.1663497118; _gat=1',
				'origin': 'https://camp.xticket.kr',
				'referer': 'https://camp.xticket.kr/web/main?shopEncode=5f9422e223671b122a7f2c94f4e15c6f71cd1a49141314cf19adccb98162b5b0'
			}
		};

		const url = `https://camp.xticket.kr/Web/Book/GetBookProduct010001.json`;
		const response = await HttpRequest.request(url, options);

		console.error('response')
		console.error(response)
	}

}
