const search = require("../utils/search");

var modelName = null;
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

var fieldConfig = {
  name: "",
  type: "",
  model: "",
  default: "",
  primaryId: false,
};

const LETTER = /[a-zA-Z]/;
const isLetter = (text) => LETTER.test(text);

function keywords(count, line) {
  var code = line;
  var codeWithoutSpace = code.replaceAll(" ", "");

  if (search(codeWithoutSpace, "datasourcedb{")) {
    currentData.currentState = "datasource";
    currentData.openBracket = true;
  } else if (search(codeWithoutSpace, "}")) {
    currentData.currentState = "";
    currentData.openBracket = false;
  } else if (search(codeWithoutSpace, `model`)) {
    currentData.currentState = "model";
    currentData.openBracket = true;
  }

  switch (currentData.currentState) {
    case "datasource":
      if (search(codeWithoutSpace, "provider:")) {
        const providerPosition = codeWithoutSpace.search('"') + 1;
        const providerFinishPosition = codeWithoutSpace.length - 1;

        currentData.datasource.provider = codeWithoutSpace.substring(
          providerPosition,
          providerFinishPosition
        );
      } else if (search(codeWithoutSpace, "url:")) {
        var urlPosition = null;
        var urlFinishPosition = null;
        if (codeWithoutSpace.toLowerCase().search("env") != -1) {
          urlPosition = codeWithoutSpace.toLowerCase().search("env");
          urlFinishPosition = codeWithoutSpace.length;
        } else {
          urlPosition = codeWithoutSpace.search('"') + 1;
          urlFinishPosition = codeWithoutSpace.length - 1;
        }

        currentData.datasource.url = codeWithoutSpace.substring(
          urlPosition,
          urlFinishPosition
        );
      }
      break;

    case "model":
      fieldConfig = {
        name: "",
        type: "",
        model: "",
        default: "",
        primaryId: false,
      };
      if (search(codeWithoutSpace, `model`)) {
        modelName = codeWithoutSpace.substring(
          codeWithoutSpace.search("model") + 5,
          codeWithoutSpace.length - 1
        );
        break;
      }

      if (!currentData.models.includes(modelName)) {
        currentData.models.push(modelName);
      }

      fieldConfig.model = modelName;
      const field = code
        .replaceAll(": ", ":")
        .replaceAll(" : ", ":")
        .replaceAll(" :", ":")
        .replaceAll(", ", ",")
        .replaceAll(" , ", ",")
        .replaceAll(" ,", ",")
        .replaceAll(/  +/g, "-")
        .replaceAll(" ", "-")
        .split("-");

      field.shift();

      const validTypes = ["String", "Boolean", "Int"];

      for (let fieldSpecification of field) {
        if (validTypes.includes(fieldSpecification)) {
          fieldConfig.type = fieldSpecification;
        } else if (search(fieldSpecification, "@id")) {
          fieldConfig.primaryId = true;
        } else if (search(fieldSpecification, "default")) {
          const defaultTypes = ["uuid()", "date()", "autoincrement()"];

          for (
            let defaultTypeIndex = 0;
            defaultTypeIndex <= defaultTypes.length - 1;
            defaultTypeIndex++
          ) {
            const fieldDefault = fieldSpecification.substring(
              fieldSpecification.indexOf("(") + 1,
              fieldSpecification.length - 1
            );
            const defaultType = defaultTypes[defaultTypeIndex];

            if (fieldDefault == defaultType) {
              fieldConfig.default = defaultType;
            }
          }
        } else if (isLetter(fieldSpecification)) {
          fieldConfig.name = fieldSpecification;
        }
      }

      currentData.fields.push(fieldConfig);

      break;
  }

  console.log("[Server] Using keywords... " + currentData.currentState);

  return currentData;
}

module.exports = keywords;
