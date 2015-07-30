window.onload = function() {
	document.querySelector("#sub").addEventListener("click", process);
	document.querySelector("#sen").addEventListener("click", construct);
	document.querySelector("#clear").addEventListener("click", clear);
	document.querySelector("#personInput").addEventListener("keyup", getInput);
	var edit = document.querySelector("#daStuff");
	// edit.addEventListener("blur", function(){
	// 	localStorage.setItem("daStuff", this.innerHTML);
	// 	document.designMode = "off";
	// });
	// edit.addEventListener("focus", function(){
	// 	document.designMode = "on";
	// });
	// edit.addEventListener("keyup", editor);
	edit.addEventListener("keypress", editor);

	rangy = require('rangy');
	$ = require('jquery');
	require('rangy/lib/rangy-selectionsaverestore.js');
	require('rangy/lib/rangy-textrange.js');
	require('rangy/lib/rangy-classapplier.js');
};

var $ = null;
var rangy = null;
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

function editor(event){
	contentMalleable("daStuff", "word", function(elem, appl){});
	var writing = document.querySelector("#daStuff");

	if(event.key == " "){
		var sel = rangy.getSelection();
		var range = rangy.createRange();
		var typed = sel.focusNode;
		var node = typed.previousSibling;
		while((!(/\b\w+\b/.test(node.textContent)))&&(node)){
			node = node.previousSibling;
			console.log(node.textContent);
		}
		var text = node.textContent;
		var changedText = text.trim();

		var nextWord = generateWord(changedText);
		if(nextWord){
			typed.textContent = nextWord;
			contentMalleable("daStuff", "word", function(elem, appl){});
			//set the caret after the node for this range
			range.setStartAfter(typed);
			range.setEndAfter(typed);

			//apply this range to the selection object
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}


}

function generateWord(word){
	try{
		var len = dict[word].length;
		var rand = randomInt(len-1, 0);
		return dict[word][rand];
	} catch (e) {
		return null;
	}

}

//funci courtesy of Allison Parrish - https://github.com/aparrish/contentmalleable/blob/master/contentmalleable.js
function contentMalleable(elemId, spanClass, onElementCreate) {
    var sel = rangy.getSelection();
    var savedSel = rangy.saveSelection();
    var applier = rangy.createClassApplier(spanClass, {
        normalize: false,
        onElementCreate: onElementCreate
    });
    var range = rangy.createRange();
    while (range.findText(/\b\w+\b/)) {
        // don't attempt to re-apply if the selection is in the range
        if (range.intersectsNode(
                $('.rangySelectionBoundary').get(0), true)) {
            range.collapse(false);
        }
        else if (!range.intersectsNode(document.getElementById(elemId))) {
            range.collapse(false);
        }
        else {
            applier.applyToRange(range);
            range.collapse(false);
        }
    }
    // get rid of class around the text next to the selection
    var selElem = $('.rangySelectionBoundary').get(0);
    $('.'+spanClass).each(function(i) {
        if ($(this).get(0).nextSibling == selElem) {
            $(this).contents().unwrap();
        }
    });
    // if any spans have more than one word in them now, unwrap
    $('.'+spanClass).each(function(i) {
        if ($(this).text().match(/\b.+\b.+\b/)) {
            $(this).contents().unwrap();
        }
    });

    // attempt to remove stupid contenteditable garbage
    $('#'+elemId + ' span').each(function(i) {
        if ($(this).attr('class') == undefined) {
            $(this).contents().unwrap();
        }
    });
    rangy.restoreSelection(savedSel);
}

module.exports.contentMalleable = contentMalleable;

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