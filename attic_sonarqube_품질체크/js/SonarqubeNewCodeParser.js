class SonarqubeNewCodeParser {
	static parse(response) {
		let coverage = 0;
		let lineOfCode = 0;
		let sqaleIndex = 0;
		let codeSmell = 0;
		let bugs = 0;
		let vulnerability = 0;
		let duplicatedLine = 0;

		console.error(response)
		response.component.measures.map(measure =>  {
			if (measure.metric === 'quality_gate_details') {
				const value = JSON.parse(measure.value);

				value.conditions.map(condition => {
					if (condition.metric === 'new_code_smells') {
						codeSmell = condition.actual;
					} else if (condition.metric === 'new_bugs') {
						bugs = condition.actual;
					} else if (condition.metric === 'new_vulnerabilities') {
						vulnerability = condition.actual;
					} else if (condition.metric === 'new_duplicated_lines') {
						duplicatedLine = condition.actual;
					}
				});
			} else if (measure.metric === 'coverage') {
				coverage = measure.value;
			}
		});

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