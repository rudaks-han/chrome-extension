var buyButton = document.querySelector("._buy_button");
console.error('___buyButton: ' + buyButton)

if (buyButton != null) {
	buyButton.click();
} else {
	checkBuyButton = function () {
		for (i=0; i < 10; i++) {
			(function(x) {
				document.location.reload();

				setTimeout(function() {
					var buyButton = document.querySelector("._buy_button");
					console.error('___buyButton: ' + buyButton)
				}, 3000);
			})(i);
		}
	}

	checkBuyButton();
}
