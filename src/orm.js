const convertToSQL = require("./helpers/convertToSQL");

function orm(parsedJson) {
  console.log("[Server] Using ORM...");

  var modelConfig = {
    model: "",
    fields: [],
  };

  const modelPendencies = [];

  for (
    let dataIndex = 0;
    dataIndex <= parsedJson.models.length - 1;
    dataIndex++
  ) {
    const modelName = parsedJson.models[dataIndex];
    modelConfig = {
      model: modelName,
      fields: [],
    };
    modelPendencies.push(modelConfig);
  }

  for (
    let dataIndex = 0;
    dataIndex <= parsedJson.fields.length - 1;
    dataIndex++
  ) {
    let fieldConfig = parsedJson.fields[dataIndex];

    for (
      let modelIndex = 0;
      modelIndex <= parsedJson.models.length - 1;
      modelIndex++
    ) {
      modelPendencies[modelIndex].fields.push(fieldConfig);
    }
  }

  const SQL = convertToSQL(modelPendencies);

  console.log("[Server] Written Migration, result : \n\n", SQL);
  return SQL;
}

module.exports = orm;
