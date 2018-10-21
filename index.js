const deployment = require("./dist/deployment").default;

module.exports = (config, dir) => {
  deployment(config, dir);
};
