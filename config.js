const StyleDictionary = require("style-dictionary");
const { formatHelpers } = StyleDictionary;

const tokenFilter = (cat) => (token) => token.attributes.category === cat;

const transformPathToCammelCase = (path) =>
  path.reduce((acc, str, index) => {
    const _str = index === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
    return acc.concat(_str);
  }, "");

const mapTokensToObject = (dictionary) =>
  "{\n" +
  dictionary.allTokens
    .map(function (token) {
      // Use the path of the token to create the variable name, skip the first item
      const [, ..._path] = token.path;
      const name = transformPathToCammelCase(_path);
      return `  ${name}: ${JSON.stringify(token.value)},`;
    })
    .join("\n") +
  "\n};";

module.exports = {
  source: ["output.json"],
  format: {
    "javascript/export-default": function ({ dictionary, file }) {
      return (
        formatHelpers.fileHeader({ file }) +
        "export default " +
        mapTokensToObject(dictionary) +
        "\n"
      );
    },
  },
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
        },
      ],
    },
    js: {
      transformGroup: "js",
      buildPath: "js/",
      files: [
        {
          filter: tokenFilter("scales"),
          destination: "scales.js",
          format: "javascript/export-default",
        },
        {
          filter: tokenFilter("aliases"),
          destination: "aliases.js",
          format: "javascript/export-default",
        },
      ],
    },
  },
};
