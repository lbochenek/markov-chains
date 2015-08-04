window.onload = function() {
	document.querySelector("#sub").addEventListener("click", processInput);
	document.querySelector("#daStuff").addEventListener("keypress", editor);

	rangy = require('rangy');
	$ = require('jquery');
	require('rangy/lib/rangy-selectionsaverestore.js');
	require('rangy/lib/rangy-textrange.js');
	require('rangy/lib/rangy-classapplier.js');

	$('#chooseCustom').children().hide();
	$('#afterSelection').children().hide();

	//input own text instead of choosing from dropdown
	document.querySelector("#otherText").addEventListener("click", function(e){
		$("#choosePreLoaded").children().hide();
		$("#chooseCustom").children().show();
	});

	//return from inputed text to dropdown options
	document.querySelector("#choose").addEventListener("click", function(e){
		$("#chooseCustom").children().hide();
		$("#choosePreLoaded").children().show();
	});

	//start over and enter new text
	document.querySelector('#back').addEventListener("click", function(e){
		$("#afterSelection").children().hide();
		$("#beforeSelection").children().show();
		$("#chooseCustom").children().hide();
		$("#choosePreLoaded").children().show();
		dict = {};
		$('#daStuff').empty().append('<span class="word">Edit</span>');
	});

	document.querySelector('#subDrop').addEventListener("click", processSelected);
};

var $ = null;
var rangy = null;
var dict = {};
function processInput()
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
	$("#chooseCustom").children().hide();
	$("#choosePreLoaded").children().hide();
	$("#beforeSelection").children().hide();
	$('#afterSelection').children().show();
}

function processSelected(){
	var author = document.querySelector("#writeLike").value;
	var path = author + ".json";
	$.ajax({
		url: path,
		type: "GET",
		dataType: "json",
		success: function(data){
			dict = data;
		},
		error: function(xhr, status, errorThrown){
			alert("Oops! Our mistake!");
			console.log("Error: "+errorThrown);
			console.log("Status: "+status);
			console.dir( xhr );
		},
		complete: function(xhr, status){
			$("#chooseCustom").children().hide();
			$("#choosePreLoaded").children().hide();
			$("#beforeSelection").children().hide();
			$('#afterSelection').children().show();
		}
	});
}

function randomInt(max, min)
{
	var rand = Math.floor(Math.random() * (max - min + 1)) + min;
	return rand;
}

replaced = true;
function editor(event){
	contentMalleable("daStuff", "word", function(elem, appl){});
	var writing = document.querySelector("#daStuff");

	if(event.key == " "){
		if(replaced){
			var sel = rangy.getSelection();
			var range = rangy.createRange();
			var typed = sel.focusNode;
			var typedWord = typed.textContent;
			//check for end of sentence or contraction
			if(/[.?!]/.test(typedWord)){
				return;
			}
			var node = typed.previousSibling;
			while((!(/\b\w+\b/.test(node.textContent)))&&(node)){
				if(/['-]/.test(node.content)||/['-]/.test(node.textContent)){
					return;
				}
				node = node.previousSibling;
			}

			var text = node.textContent;
			var changedText = text.trim().toLowerCase().replace(/[^\w\s]|_/g, "");

			var nextWord = generateWord(changedText);
			if(nextWord){
				console.log("original: " + typedWord, "new: " + nextWord, "based from: " + text);
				typed.textContent = nextWord;
				contentMalleable("daStuff", "word", function(elem, appl){});

				//http://stackoverflow.com/questions/18351001/move-keyboard-caret-to-the-end-of-element-with-rangy
				//set the caret after the node for this range
				range.setStartAfter(typed);
				range.setEndAfter(typed);

				//apply this range to the selection object
				sel.removeAllRanges();
				sel.addRange(range);

				replaced = false;
				contentMalleable("daStuff", "word", function(elem, appl){});
			}
		} else {
		replaced = true;
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