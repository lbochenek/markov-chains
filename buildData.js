var fs = require('fs');
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('text/austen.txt');

var dict = {};
var lastWord = null;

lr.on('error', function(err){console.log(err)});
lr.on('line', function(line){
  var words = line.split(/[\s]+|-{2,}/);
  if(lastWord){
    words[0] = words[0].replace(/[^\w'-]/g, "");
    if(title(words[0])||/^((I'(ll|m|d've|d))|I)$/.test(words[0])){
      var newWord = words[0];
    } else {
      var newWord = words[0].toLowerCase();
    }
    if((dict[lastWord] === undefined)||((typeof dict[lastWord] != "string")&&(typeof dict[lastWord] != "object")))
    {
      dict[lastWord] = [newWord];
    }
    else
    {
      dict[lastWord].push(newWord);
    }
  }
  for(var i=1; i<words.length; i++){
    words[i] = words[i].replace(/[^\w'-]/g, "");
    if(title(words[i])||/^((I'(ll|m|d've|d))|I)$/.test(words[i])){
      var word = words[i];
    } else {
      var word = words[i].toLowerCase();
    }
    if(title(words[i-1])||/^((I'(ll|m|d've|d))|I)$/.test(words[i-1])){
      var previousWord = words[i-1];
    } else {
      var previousWord = words[i-1].toLowerCase();
    }
    if(word != ""){
      if((dict[previousWord] === undefined)||((typeof dict[previousWord] != "string")&&(typeof dict[previousWord] != "object")))
      {
        dict[previousWord] = [word];
      }
      else
      {
        dict[previousWord].push(word);
      }
    }
    if(i == words.length-1){
      lastWord = word;
    }
  }
});

lr.on('end', function () {
  console.log(JSON.stringify(dict));
});

function title(word)
{
  switch(word)
  {
    case "Mr":
      break;
    case "Messrs":
      break;
    case "Mrs":
      break;
    case "Ms":
      break;
    case "Mmes":
      break;
    case "Dr":
      break;
    case "Drs":
      break;
    case "Prof":
      break;
    case "Profs":
      break;
    case "Fr":
      break;
    case "Frs":
      break;
    case "Sr":
      break;
    case "Srs":
      break;
    case "St":
      break;
    case "Sts":
      break;
    case "Gen":
      break;
    case "Rep":
      break;
    case "Reps":
      break;
    case "Sen":
      break;
    case "Sens":
      break;
    default:
      return false;
  }

  return true;
}