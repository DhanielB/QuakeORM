const keywords = require("./helpers/keywords");

var currentData = {
  openBracket: false,
  currentState: "",
  models: [],
  fields: [],
  datasource: {
    url: "",
    provider: "posgresql",
  },
};

function parse(lines) {
  console.log(`[Server] Parsing...\n\n${lines}\n`);
  var currentLine = 0;
  const linesArray = lines.split("\n");
  const linesLength = linesArray.length - 1;

  while (currentLine <= linesLength) {
    currentData = keywords(currentLine + 1, linesArray[currentLine]);

    currentLine++;
  }

  return currentData;
}

module.exports = parse;
