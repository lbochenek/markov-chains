window.onload = function() {document.querySelector(".sub-button").addEventListener("click", process);};
var dict = {};
function process()
{
	var text = document.querySelector("#sourceText").value;
	var words = text.split(/[\t \n\r]+/);
	// var dict = {};
	var possibleFirsts = [];
	words = handlePeriods(0); //handle case where first word is a sentence
	possibleFirsts.push(words[0]);
	for(var i=1; i<words.length; i++)
	{
		var w = words[i];
		var wmin1 = words[i-1];
		if(w != "")
		{
			if(w!=". ")
			{
				words = handlePeriods(i);
			}

			if(dict[wmin1] === undefined)
			{
				dict[wmin1] = [w];
			}
			else
			{
				dict[words[i-1]].push(words[i]);
			}
		}
	}
	console.log(words);
	console.log(dict);
	console.log(possibleFirsts);
	construct(dict, possibleFirsts);

	function handlePeriods(i) //needs to include !, ?, and ... (maybe "" too?)
	{
		var t = words[i];
		if(/(\.)$/.test(t)) //add period as new word
		{
			words[i] = words[i].split(".")[0];
			if(i<(words.length-1))
			{
				words.splice((i+1), 0, ". ");
			}
			else
			{
				words.push(". ");
			}

			if(i < (words.length-2)) //get list of first choices
			{
				possibleFirsts.push(words[i+2]);
			}
		}
		return words;
	}
}

function construct(dict, possibleFirsts)
{
	var str = "";
	var word = possibleFirsts[randomInt(possibleFirsts.length-1, 0)];
	if(/(\.)$/.test(word))
	{
		word = word.split(".")[0];
	}
	// console.log(str);
	// console.log(word);
	// console.log(dict[word]);
	while(word != ". ")
	{
		if(word != ". ")
			str += " ";
		var len = dict[word].length;
		var rand = randomInt(len-1, 0);
		console.log("dict length: " + dict[word].length + " " + rand);
		word = dict[word][rand];
		str += word;
		console.log(word);
	}

	console.log(str);
	var res = document.querySelector("#outcome");
	var t = document.createTextNode(str);
	res.appendChild(t);
	console.log(str);
}

function randomInt(max, min)
{
	return Math.floor(Math.random() * (max - min)) + min;
}