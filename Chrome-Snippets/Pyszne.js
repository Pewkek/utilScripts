let menu = document.querySelector('#page > div._2gQt3a > section > div._2rTX_v > section');
let menuItems = menu.querySelectorAll('section div[role="list"] div[menu-item-id] > div > div > div:nth-of-type(1) > div > div');
let list = {};
for(item of menuItems)
{
    let name = item.querySelector('h3[data-qa="heading"] > span').parentElement.textContent;
    let ingredients = item.querySelector('div._2LV0z.Rfk_i > div._2LV0z.Rfk_i');

    if(ingredients == null)
    {
        list[name] = ingredients = "";
    }
    else
    {
        list[name] = ingredients.textContent.split(/(?: ?, )|(?: i )|(?: oraz )/);
    }
}

let nameToFind = ["Pizza"];
let ingredientsToFind = [""];
console.clear();
console.log("%cWyszukane dania: %c"+nameToFind, 'color: rgb(140, 0, 240); font-size: 2em', 'color: #e0e0e0; font-size: 2em');
console.log("%cSkładniki: %c"+ingredientsToFind, 'color: red; font-size: 2em', 'color: rgb(255, 230, 0); font-size: 2em');

for(item in list)
{
    shouldContinue = true;
    for(correctName of nameToFind)
    {
        let reName = new RegExp('.*'+correctName.toLowerCase()+'.*');
        if(item.toLowerCase().match(reName))
        {
            continue;
        }
        shouldContinue = false;
    }

    if(!shouldContinue)
    {
        continue;
    }

    let ingredients = list[item];
    if(ingredients != "")
    {
        let found = Object.fromEntries(ingredientsToFind.map(x => [x, false]));
        for(ingr of ingredients)
        {
            for(toFind of ingredientsToFind)
            {
                let re = new RegExp('.*'+toFind+'.*');
                if(ingr.match(re))
                {
                    found[toFind] = true;
                }
            }
        }

        let cont = false;
        for(name in found)
        {
            let check = found[name];
            if(!check)
            {
                cont = true;
                break;
            }
        }
        if(!cont)
        {

            console.log("%c"+item.padEnd(50) + "%c" + ingredients, 'color: rgb(0, 180, 255)', 'color: rgb(0, 255, 100)');
        }
    }
    else
    {
            console.log("%c"+item, 'color: rgb(0, 180, 255)');
    }
}