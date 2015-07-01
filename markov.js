window.onload = function() {
	document.querySelector("#sub").addEventListener("click", process);
	document.querySelector("#sen").addEventListener("click", construct);
	document.querySelector("#clear").addEventListener("click", clear);
	document.querySelector("#personInput").addEventListener("keyup", getInput);
	var edit = document.querySelector("#daStuff");
	edit.addEventListener("blur", function(){
		localStorage.setItem("daStuff", this.innerHTML);
		document.designMode = "off";
	});
	edit.addEventListener("focus", function(){
		document.designMode = "on";
	});
	edit.addEventListener("keyup", editor);

	// if (localStorage.getItem('daStuff'))
	// {
 //  	document.querySelector("#daStuff").innerHTML = localStorage.getItem('daStuff');
	// }
};



var dict = {};
var possibleFirsts = [];
var punctReg = /([\.?!,;:])$/;
var checkCommas = /[,;:]$/;
var endSen = /([\.?!])$/;
var solelyPunct = /^([\.?!,;:]){1,}$/;
var solelyEnd = /^([\.?!]){1,}$/;
var userStr = "";
var future = [];
var index = 0;
function process()
{
	dict = {};
	possibleFirsts = [];
	var text = document.querySelector("#sourceText").value;
	var words = text.split(/[\t \n\r]+/);
	words[0] = words[0].replace("\"", '');
	words = punctCheck(0); //handle case where first word has punctuation
	possibleFirsts.push(words[0]);
	for(var i=1; i<words.length; i++)
	{
		if(words[i] != "")
		{
			words[i] = words[i].replace("\"", '');
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
					words[i+2] = words[i+2].replace("\"", '');
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

	localStorage.clear();
	window.location = window.location; //refresh
}

function getInput(event)
{
	var field = document.querySelector("#personInput");
	switch(event.keyCode)
	{
		case 32: //space
			var pos = doGetCaretPosition(field);
			var w = getWord(pos, field);
			break;
		case 8: //backspace
			userStr = userStr.slice(0, -1);
			break;
		default:
			userStr += String.fromCharCode(event.charCode);
			// console.log(userStr);
	}
}

function getWord(pos, field)
{
	// var text = field.value.split(/[\t \n\r]+/);
	// for(var i=pos-2; (i>=0)&&(text.charAt(i)!=" "); i--){}
	// var word = text.substr(i+1, pos-1).split(" ")[0];

	// future.push(word);
	// if(i)

	// return word;
}

//http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
function doGetCaretPosition (oField)
{
  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection)
  {

    // Set focus on the element
    oField.focus ();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange ();

    // Move selection start to 0 position
    oSel.moveStart ('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }
  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return (iCaretPos);
}

function editor(event)
{
	var container = document.querySelector("#daStuff");
	var spans = document.querySelectorAll(".word");
	if(event.keyCode == 32)//space
	{
		for(var i=0; i<spans.length; i++)
		{
			if(/\b.+\b.+\b/.test(spans[i].textContent))
			{
				var wds = spans[i].textContent.split(" ");
				spans[i].textContent = wds[0];
				var sp = document.createElement("span");
				sp.className = "word";
				var content = document.createTextNode(wds[wds.length-1]);
				sp.appendChild(content);
				container.appendChild(sp);
			}
		}
	}
	// console.log(event.keyCode);

	if(event.keyCode == 8)//backspace
	{
		for(var i=0; i<spans.length; i++)
		{
			if(spans[i].textContent == "")
			{
				container.removeChild(spans[i]);
				console.log("removed");
			}
		}
	}
}

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