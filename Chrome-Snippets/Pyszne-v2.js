let li = document.querySelector('ul[aria-label="Otwarte"]');
let ulsObj = li.querySelectorAll('li');
let uls = Object.keys(ulsObj).map(index => {return ulsObj[index]});

let sorted = uls.sort(function(a, b){
		let priceSelA = a.querySelector('div[data-qa="delivery-costs-indicator-content"] span > span');
		let priceSelB = b.querySelector('div[data-qa="delivery-costs-indicator-content"] span > span');

		let minPriceSelA = a.querySelector('div[data-qa="mov-indicator-content"] span > span');
		let minPriceSelB = b.querySelector('div[data-qa="mov-indicator-content"] span > span');
	
	
		let priceA;
		let priceB;
		let minPriceA;
		let minPriceB;
	
		priceA = (priceSelA === null) ? 0 : parseFloat(priceSelA.textContent);
		priceB = (priceSelB === null) ? 0 : parseFloat(priceSelB.textContent);

		minPriceA = (minPriceSelA === null) ? 0 : parseFloat(minPriceSelA.textContent);
		minPriceB = (minPriceSelB === null) ? 0 : parseFloat(minPriceSelB.textContent);

		let scoreA = (priceA/4)*5 + (minPriceA/25)*10;
		let scoreB = (priceB/4)*5 + (minPriceB/25)*10;
	
	
		if(scoreA < scoreB)
		{
			return -1;
		}

		if(scoreA > scoreB)
		{
			return 1;
		}
	
		return 0;
});

li.replaceChildren();
li.replaceChildren(...sorted);