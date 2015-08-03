window.onload = function() {
	document.querySelector("#sub").addEventListener("click", process);
	document.querySelector("#clear").addEventListener("click", clear);
	document.querySelector("#daStuff").addEventListener("keypress", editor);

	rangy = require('rangy');
	$ = require('jquery');
	require('rangy/lib/rangy-selectionsaverestore.js');
	require('rangy/lib/rangy-textrange.js');
	require('rangy/lib/rangy-classapplier.js');

	$('#afterHeading').hide();
	$('#daStuff').hide();
	$('#clear').hide();
	$('#sourceText').hide();
	$('#sub').hide();
	$('#choose').hide();
	$('#back').hide();

	document.querySelector("#otherText").addEventListener("click", function(e){
		$("#otherText").hide();
		$("#writeLike").hide();
		$("#subDrop").hide();
		$('#back').hide();
		$('#sourceText').show();
		$('#sub').show();
		$('#choose').show();
	});

	document.querySelector("#choose").addEventListener("click", function(e){
		$("#otherText").show();
		$("#writeLike").show();
		$("#subDrop").show();
		$('#sourceText').hide();
		$('#sub').hide();
		$('#choose').hide();
	});

	document.querySelector('#back').addEventListener("click", function(e){
		$('#daStuff').hide();
		$('#afterHeading').hide();
		$("#otherText").show();
		$("#writeLike").show();
		$("#subDrop").show();
		$('#heading').show();
		$('#back').hide();
		dict = {};
		$('#daStuff').empty();
	});
};

var $ = null;
var rangy = null;
var dict = {};
var punctReg = /([\.?!,;:])$/;
var checkCommas = /[,;:]$/;
var endSen = /([\.?!])$/;
var solelyPunct = /^([\.?!,;:]){1,}$/;
var solelyEnd = /^([\.?!]){1,}$/;
function process()
{
	dict = {};
	var text = document.querySelector("#sourceText").value;
	var words = text.split(/[^\w]+/);
	for(var i=1; i<words.length; i++)
	{
		var word = words[i].toLowerCase();
		var previousWord = words[i-1].toLowerCase();
		if(word != "")
		{
			word = word.replace("\"", '');
			if((dict[previousWord] === undefined)||((typeof dict[previousWord] != "string")&&(typeof dict[previousWord] != "object")))
			{
				dict[previousWord] = [word];
			}
			else
			{
				dict[previousWord].push(word);
			}
		}
	}

	console.log(dict);
	$('#daStuff').show();
	$('#afterHeading').show();
	$("#otherText").hide();
	$("#writeLike").hide();
	$("#subDrop").hide();
	$('#sourceText').hide();
	$('#sub').hide();
	$('#choose').hide();
	$('#heading').hide();
	$('#back').show();

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

function editor(event){
	contentMalleable("daStuff", "word", function(elem, appl){});
	var writing = document.querySelector("#daStuff");

	if(event.key == " "){
		var sel = rangy.getSelection();
		var range = rangy.createRange();
		var typed = sel.focusNode;
		var typedWord = typed.textContent;
		var node = typed.previousSibling;
		while((!(/\b\w+\b/.test(node.textContent)))&&(node)){
			node = node.previousSibling;
		}
		var text = node.textContent;
		var changedText = text.trim();

		var nextWord = generateWord(changedText);
		if(nextWord){
			console.log("original", typedWord, "new", nextWord);
			typed.textContent = nextWord;
			contentMalleable("daStuff", "word", function(elem, appl){});

			//http://stackoverflow.com/questions/18351001/move-keyboard-caret-to-the-end-of-element-with-rangy
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

//function courtesy of Allison Parrish - https://github.com/aparrish/contentmalleable/blob/master/contentmalleable.js
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