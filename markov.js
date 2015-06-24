window.onload = function() {document.querySelector(".sub-button").addEventListener("click", process);};
function process()
{
	var text = document.querySelector("#sourceText").value;
	var words = text.split(/[\t \n\r]+/);
	var dict = {};
	var possibleFirsts = [];
	words = handlePeriods(0); //handle case where first word is a sentence
	possibleFirsts.push(words[0]);
	for(var i=1; i<words.length; i++)
	{
		if(words[i] != "")
		{
			if(words[i]!=". ")
			{
				words = handlePeriods(i);
			}

			if(dict[words[i-1]] === undefined)
			{
				dict[words[i-1]] = [words[i]];
			}
			else
			{
				console.log("words[i]:", words[i], "words[i-1]:", words[i-1], "dict[words[i-1]]:", dict[words[i-1]]);
				dict[words[i-1]].push(words[i]);
			}
		}
	}
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
	console.log(dict);
	var str = "";
	var word = possibleFirsts[randomInt(possibleFirsts.length-1, 0)];
	str += word;
	if(/(\.)$/.test(word))
	{
		word = word.split(".")[0];
	}

	while(word != ". ")
	{
		if(word != ". ")
			str += " ";
		var len = dict[word].length;
		var rand = randomInt(len-1, 0);
		word = dict[word][rand];
		str += word;
	}

	var res = document.querySelector("#outcome");
	var t = document.createTextNode(str);
	res.appendChild(t);
}

function randomInt(max, min)
{
	return Math.floor(Math.random() * (max - min)) + min;
}