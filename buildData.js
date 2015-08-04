var fs = require('fs');
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('text/shakespeare.txt');

var dict = {};
var lastWord = null;

lr.on('error', function(err){console.log(err)});
lr.on('line', function(line){
  var words = line.split(/[\s]+|-{2,}/);
  if(lastWord){
    words[0] = words[0].replace(/[^\w'-]/g, "");
    var newWord = words[0];
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
    var word = words[i];
    var previousWord = words[i-1];
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