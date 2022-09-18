class CodeParser {
	execute(response) {

		let newBug = 0;
		let newVulnerabilities = 0;
		let newSecurityHotSpots = 0;
		let newCodeSmells = 0;
		let newCoverage = 0;
		let newDuplicatedLinesDensity = 0;

		let component = response.component;

		component.measures.map(measure =>  {
			const metric = measure.metric;

			if (metric === 'bugs') {
				newBug = this.getValue(measure);
			} else if (metric === 'vulnerabilities') {
				newVulnerabilities = this.getValue(measure);
			} else if (metric === 'security_hotspots') {
				newSecurityHotSpots = this.getValue(measure);
			} else if (metric === 'code_smells') {
				newCodeSmells = this.getValue(measure);
			} else if (metric === 'coverage') {
				newCoverage = this.getValue(measure);
			} else if (metric === 'duplicated_lines_density') {
				newDuplicatedLinesDensity = this.getValue(measure);
				newDuplicatedLinesDensity = Number(newDuplicatedLinesDensity);
				newDuplicatedLinesDensity = newDuplicatedLinesDensity.toFixed(1);
			}
		});

		// ATTIC_application
		//let componentName = this.capitalize(response.component.name.substring(6));
		let componentName = response.component.name;

		return {
			componentName,
			newBug,
			newVulnerabilities,
			newSecurityHotSpots,
			newCodeSmells,
			newCoverage,
			newDuplicatedLinesDensity
		};
	}

	getValue(measure) {
		//return measure.periods.filter(period => period.index === 1).map(period => period.value);
		return measure.value;
	}

	capitalize(name) {
		return name.charAt(0).toUpperCase() + name.slice(1);
	}
}
