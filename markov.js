window.onload = function() {
	document.querySelector("#sub").addEventListener("click", process);
	document.querySelector("#sen").addEventListener("click", construct);
	document.querySelector("#clear").addEventListener("click", clear);
	// document.querySelector("#personInput").addEventListener("keydown", getInput)
};

var dict = {};
var possibleFirsts = [];
var punctReg = /([\.?!,;:])$/;
var checkCommas = /[,;:]$/;
var endSen = /([\.?!])$/;
var solelyPunct = /^([\.?!,;:]){1,}$/;
var solelyEnd = /^([\.?!]){1,}$/;
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
			if(!(solelyPunct.test(words[i])))//just punctuation
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
	// console.log(words);

	function punctCheck(i)
	{
		var t = words[i];
		if(needToPunctCheck(t)) //add punctuation as new word
		{
			if(!title(t))
			{

				var punctFunct = function(string, ind){return punctReg.test(string.charAt(ind))};
				var seperated = sepPunct(t, punctFunct);

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

				if((i < (words.length-2))&&endSen.test(t)) //make list of first choices
				{
					var sep = sepPunct(words[i+2], punctFunct);
					possibleFirsts.push(sep.rest);
				}
			}
		}
		return words;
	}
}

function needToPunctCheck(str)
{
	return punctReg.test(str);
}

function sepPunct(str, tester)
{
	for(var i=str.length-2; (i>=0)&&tester(str, i); i--){}
	if(needToPunctCheck(str) && !title(str))
	{
		if(punctReg.test(str.charAt(i+1)))
		{
			var newStr = str.substr(0, i+1);
			var punct = str.substr(i+1, str.length-1);
		}
		else
			var newStr = str;
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

	while(!(solelyEnd.test(word)))
	{
		str += " ";
		console.log("dict[word]", dict[word], word);
		var len = dict[word].length;
		var rand = randomInt(len-1, 0);
		word = dict[word][rand];
		str += word;

		if(checkCommas.test(word))//if comma
		{
			str = properSpacing(str, function(string, ind){return checkCommas.test(string.charAt(ind));});
		}
	}

	//have proper spacing at end of sentence and with commas
	str = properSpacing(str, function(string, ind){return string.charAt(ind)!=" ";});

	//append to document
	var res = document.querySelector("#outcome");
	var t = document.createTextNode(str);
	res.appendChild(t);
}

function properSpacing(str, test)
{
	var seperated = sepPunct(str, test);
	seperated.rest = seperated.rest.substr(0, seperated.rest.length-1);
	return seperated.rest + seperated.punctuation + " ";
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