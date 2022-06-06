function prettier(text) {
  const prettyCode = text.replaceAll("=", ":").replaceAll("'", '"');

  console.log("[Server] Making the code beautiful");

  return prettyCode;
}

module.exports = prettier;
