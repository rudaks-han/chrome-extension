class NewCodeParser {
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

			if (metric === 'new_bugs') {
				newBug = this.getValue(measure);
			} else if (metric === 'new_vulnerabilities') {
				newVulnerabilities = this.getValue(measure);
			} else if (metric === 'new_security_hotspots') {
				newSecurityHotSpots = this.getValue(measure);
			} else if (metric === 'new_code_smells') {
				newCodeSmells = this.getValue(measure);
			} else if (metric === 'new_coverage') {
				newCoverage = this.getValue(measure);
			} else if (metric === 'new_duplicated_lines_density') {
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
		return measure.periods.filter(period => period.index === 1).map(period => period.value);
	}

	capitalize(name) {
		return name.charAt(0).toUpperCase() + name.slice(1);
	}
}