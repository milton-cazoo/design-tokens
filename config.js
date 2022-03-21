const StyleDictionary = require("style-dictionary");
const tokens = require("./data/tokens.json");
const { formatHelpers } = StyleDictionary;

const tokenFilter = (cat) => (token) => token.attributes.category === cat;

const transformToCammelCase = (name) =>
  name.reduce((acc, str, index) => {
    const _str = index === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
    return acc.concat(_str);
  }, "");

module.exports = {
  source: ["output.json"],
  format: {
    "javascript/cammel-case": (opts) => {
      const { dictionary, file } = opts;
      let output = formatHelpers.fileHeader(file);

      dictionary.allTokens.forEach((token) => {
        const { path, original } = token;

        // Use the path of the token to create the variable name, skip the first item
        const [, ..._path] = path;
        const name = transformToCammelCase(_path);

        output += `export const ${name} = \"${original.value}\";\n`;
      });

      return output;
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
          format: "javascript/cammel-case",
        },
        {
          filter: tokenFilter("aliases"),
          destination: "aliases.js",
          format: "javascript/cammel-case",
        },
      ],
    },
  },
};
