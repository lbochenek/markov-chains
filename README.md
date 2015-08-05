## Description
Collaborate with your favorite author, writing sentences with words that both you and your favorite author have selected together.

## Usage
1. Choose source text:
  1. Select a pre-processed choice from the drop down menu
  2. Click 'I have a better idea..' and paste in text that you want to write like
2. Write!

## How does this work?
While the user is typing, the app generates what word was likely to come after the previously typed word using markov chains populated from the source text.

## Credits
This app would not exist without several invaluable sources:

1. <a href='http://ojack.github.io/'>Olivia Jack</a>, who showed me that I can use markov chains without linear algebra
2. <a href='http://www.decontextualize.com/'>Allison Parrish</a>
  1. Inspiration for this app comes from her <a href='http://static.decontextualize.com/rhymingkb/'>Rhyming Keyboard</a>
  2. The typing functionality of this app would not exist without her <a href='https://github.com/aparrish/contentmalleable'>contentMalleable</a> method, which separates the text in a `contentmalleable` into distinct words
3. <a href='https://www.gutenberg.org/'>Project Gutenberg</a>, which provided the source texts used to generate the markov chains
4. Various forms of CSS help
  1. <a href='http://getbootstrap.com/'>Bootstrap</a>
  2. c.bavota's <a href='http://bavotasan.com/2011/style-select-box-using-only-css/'>styling select boxes tutorial</a>
