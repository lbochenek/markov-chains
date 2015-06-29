window.onload = function() {
	document.querySelector("#sub").addEventListener("click", process);
	document.querySelector("#sen").addEventListener("click", construct);
	document.querySelector("#clear").addEventListener("click", clear);
	// document.querySelector("#personInput").addEventListener("keydown", getInput)
};

var dict = {};
var possibleFirsts = [];
var punctReg = /([\.?!])$/;
// var str = "";
function process()
{
	dict = {};
	possibleFirsts = [];
	var text = document.querySelector("#sourceText").value;
	var words = text.split(/[\t \n\r]+/);
	words = punctCheck(0); //handle case where first word is a sentence
	possibleFirsts.push(words[0]);
	for(var i=1; i<words.length; i++)
	{
		if(words[i] != "")
		{
			if(!(/^([\.?!]){1,}$/.test(words[i])))//just punctuation
			{
				words = punctCheck(i);
			}

			if((dict[words[i-1]] === undefined)||((typeof dict[words[i-1]] != "string")&&(typeof dict[words[i-1]] != "object")))
			{
				dict[words[i-1]] = [words[i]];
			}
			else
			{
				dict[words[i-1]].push(words[i]);
			}
		}
	}

	console.log(possibleFirsts);
	console.log(dict);
	console.log(words);

// 	function handlePeriods(i) //needs to include !, ?, and ... (maybe "" too?)
// 	{
// 		var t = words[i];
// 		if(/(\.)$/.test(t)) //add period as new word
// 		{
// 			if(!title(t))
// 			{
// 				words[i] = words[i].split(".")[0];
// 				if(i<(words.length-1))
// 				{
// 					words.splice((i+1), 0, ". ");
// 				}
// 				else
// 				{
// 					words.push(". ");
// 				}

// 				if(i < (words.length-2)) //get list of first choices
// 				{
// 					possibleFirsts.push(words[i+2]);
// 				}
// 			}
// 		}
// 		return words;
// 	}
// }

	function punctCheck(i)
	{
		var t = words[i];
		if(punctReg.test(t)) //add punctuation as new word
		{
			if(!title(t))
			{

				var punctFunct = function(string, ind){return punctReg.test(string.charAt(ind))};
				var seperated = sepPunct(t, punctFunct);
				// for(var j=t.length-2; (j>=0)&&(punctReg.test(t.charAt(j))); j--){}

				// var newStr = t.substr(0, j+1);
				// var punct = t.substr(j+1, t.length-1);

				if(i < (words.length-1))
				{
					words.splice(i, 1, seperated.rest);
					words.splice((i+1), 0, seperated.punctuation);
				}
				else
				{
					words.pop();
					words.push(seperated.rest);
					words.push(seperated.punctuation);
				}

				if(i < (words.length-2)) //make list of first choices
				{
					var sep = sepPunct(words[i+2], punctFunct);
					possibleFirsts.push(sep.rest);
				}
			}
		}
		return words;
	}
}

function sepPunct(str, tester)
{
	for(var i=str.length-2; (i>=0)&&tester(str, i); i--){}
	if(punctReg.test(str.charAt(i+1)))
	{
		var newStr = str.substr(0, i+1);
		var punct = str.substr(i+1, str.length-1);
	}
	else
		var newStr = str;

	return {rest: newStr, punctuation: punct};
}

function construct()
{
	var str = "";
	var word = possibleFirsts[randomInt(possibleFirsts.length-1, 0)];
	str += word;

	while(!(/^([\.?!]){1,}$/.test(word)))
	{
		str += " ";
		console.log("dict[word]", dict[word], word);
		var len = dict[word].length;
		var rand = randomInt(len-1, 0);
		word = dict[word][rand];
		str += word;
	}

	//have proper spacing at end of sentence
	var seperated = sepPunct(str, function(string, ind){return string.charAt(ind)!=" ";});
	seperated.rest = seperated.rest.substr(0, seperated.rest.length-1); //get rid of last space
	// for(var i=str.length-2; (i>=0)&&(str.charAt(i)!=" "); i--){}
	// var punct = str.substr(i+1, str.length-1);
	// var sen = str.substr(0, i);
	str = seperated.rest + seperated.punctuation + " ";

	//append to document
	var res = document.querySelector("#outcome");
	var t = document.createTextNode(str);
	res.appendChild(t);
}

function randomInt(max, min)
{
	var rand = Math.floor(Math.random() * (max - min + 1)) + min;
	return rand;
}

function clear()
{
	document.querySelector("#sourceText").value = "";
	dict = {};
	possibleFirsts = [];
	var node = document.querySelector("#outcome");
	while(node.firstChild)
	{
		node.removeChild(node.firstChild);
	}
}

// function getInput(event)
// {
// 	// console.log(String.fromCharCode(event.keyCode), event.keyCode);
// 	switch(event.keyCode)
// 	{
// 		// case 32: //space
// 		case 8: //backspace
// 			str = str.slice(0, -1);
// 			break;
// 		default:
// 			str += String.fromCharCode(event.keyCode);
// 			console.log(str);
// 	}
// }

function title(word)
{
	switch(word)
	{
		case "Mr.":
			break;
		case "Messrs.":
			break;
		case "Mrs.":
			break;
		case "Ms.":
			break;
		case "Mmes.":
			break;
		case "Dr.":
			break;
		case "Drs.":
			break;
		case "Prof.":
			break;
		case "Profs.":
			break;
		case "Fr.":
			break;
		case "Frs.":
			break;
		case "Sr.":
			break;
		case "Srs.":
			break;
		case "St.":
			break;
		case "Sts.":
			break;
		case "Gen.":
			break;
		case "Rep.":
			break;
		case "Reps.":
			break;
		case "Sen.":
			break;
		case "Sens.":
			break;
		default:
			return false;
	}

	return true;
}