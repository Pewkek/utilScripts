let xd = document.querySelector('iframe[longdesc="https://www.random.org/integers/"]').contentWindow.document;
let ct = false;
let numberToSet = "";

let kUp = function(e)
{
    if(!ct)
    {
        return;
    }
    let evCode = e.code;
    let reMatch = evCode.match(/(?:Numpad|Digit)(\d)/);
    if(reMatch)
    {
        let digit = reMatch[1];
        numberToSet = numberToSet + digit;
    }
}

let ctrlCharacterDown = function(e)
{
    if(e.code !== "AltRight")
    {
        return;
    }
    ct = true;
}

let ctrlCharacterUp = function(e)
{
    if(e.code !== "AltRight")
    {
        return;
    }
    ct = false;
}

let panic = function(e)
{
    if(e.code != "ControlRight")
    {
        return;
    }

    ct = false;
    numberToSet = "";
}


document.addEventListener("keyup", ctrlCharacterUp);
xd.addEventListener("keyup", ctrlCharacterUp);

document.addEventListener("keydown", ctrlCharacterDown);
xd.addEventListener("keydown", ctrlCharacterDown);

document.addEventListener("keydown", kUp);
xd.addEventListener("keydown", kUp);

document.addEventListener("keydown", panic);
xd.addEventListener("keydown", panic);


let targetNode = xd.querySelector("body div");

console.log(targetNode);

let callback = function(mutationList, observer)
{
    for(const mutation of mutationList)
    {
        if(mutation.type == "childList")
        {
            let node = mutation.addedNodes[0];
            if(node.nodeName == "CENTER")
            {
                let xd = node.querySelector("span:nth-child(1)");
                if(numberToSet != "")
                {
                    xd.innerHTML = numberToSet+"<br>";
                    numberToSet = "";
                }
            }
        }
    }
}

let observer = new MutationObserver(callback);

const config = { attributes: true, childList: true, subtree: true };

observer.observe(targetNode, config);