function convertToSQL(modelPendencies) {
  var fieldsConfig = [];
  var fieldsString = "";
  var currentSQL = "";

  for (var model in modelPendencies) {
    var fields = modelPendencies[model].fields;
    var modelName = modelPendencies[model].model;
    for (var fieldIndex in fields) {
      const field = fields[fieldIndex];
      const { name, primaryId, type } = field;
      var fieldConfig = name;

      if (primaryId) {
        fieldConfig += " PRIMARY KEY";
      }

      switch (type) {
        case "String":
          fieldConfig += " VARCHAR(255)";
          break;
        case "Int":
          fieldConfig += " INT";
          break;
        case "Boolean":
          fieldConfig += " BOOLEAN";
          break;
      }
      fieldConfig += " NOT NULL";

      fieldsConfig.push(fieldConfig);
    }
  }

  for (let fieldText of fieldsConfig) {
    fieldsString += `\t${fieldText},\n`;
  }

  currentSQL = `CREATE TABLE ${modelName} (\n${fieldsString})`;
  return currentSQL;
}

module.exports = convertToSQL;
