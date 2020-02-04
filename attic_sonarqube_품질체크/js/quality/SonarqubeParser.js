class SonarqubeParser {
	static parse(response) {

		let coverageHistory = [];
		let lineOfCodeHistory = [];
		let sqaleIndexHistory = [];
		let codeSmellHistory = [];
		let bugsHistory = [];
		let vulnerabilityHistory = [];
		let duplicatedLineDensitiy = [];

		if (!response.hasOwnProperty('measures')) {
			return {};
		}

		response.measures.map(measure => {
			if (measure.metric === "coverage") {
				coverageHistory = measure.history
			} else if (measure.metric === "ncloc") {
				lineOfCodeHistory = measure.history
			} else if (measure.metric === "sqale_index") {
				sqaleIndexHistory = measure.history
			} else if (measure.metric === "code_smells") {
				codeSmellHistory = measure.history
			} else if (measure.metric === "bugs") {
				bugsHistory = measure.history
			} else if (measure.metric === "vulnerabilities") {
				vulnerabilityHistory = measure.history
			} else if (measure.metric === "duplicated_lines_density") {
				duplicatedLineDensitiy = measure.history
			}
		});


		const coverage = coverageHistory.pop().value;
		const lineOfCode = lineOfCodeHistory.pop().value;
		const sqaleIndex = sqaleIndexHistory.pop().value;
		const codeSmell = codeSmellHistory.pop().value;
		const bugs = bugsHistory.pop().value;
		const vulnerability = vulnerabilityHistory.pop().value;
		const duplicatedLine = duplicatedLineDensitiy.pop().value;

		return {
			coverage,
			lineOfCode,
			sqaleIndex,
			codeSmell,
			bugs,
			vulnerability,
			duplicatedLine
		};
	}
}