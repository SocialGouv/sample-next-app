const { defaults } = require("jest-config");

const ignorePatterns = ["<rootDir>/src"];

module.exports = {
  rootDir: "../",
  setupFilesAfterEnv: [],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    ...ignorePatterns,
  ],
  watchPathIgnorePatterns: ignorePatterns,
};
