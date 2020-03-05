var select = document.querySelector('._combination_option')
if (select != null) {
	var options = select.options;

	for (i=1; i<options.length; i++) {
		//alert(options[i].text)

		var value = options[i].value;
		var text = options[i].text;
		//console.error('value: ' + value)
		//console.error('text: ' + text)

		if (options[i].text.indexOf('품절') == -1) {
			select.querySelector('option[value="' + value + '"]').selected = true;
		}
	}
}
