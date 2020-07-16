const { defaults } = require("jest-config");

const ignorePatterns = ["<rootDir>/coverage", "<rootDir>/e2e"];

module.exports = {
  collectCoverageFrom: ["src/**/*.ts"],
  moduleDirectories: ["src", ...defaults.moduleDirectories],
  moduleNameMapper: {
    "^@socialgouv/kosko-charts(.*)$": "<rootDir>$1",
  },
  testEnvironment: "node",
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    ...ignorePatterns,
  ],
  watchPathIgnorePatterns: ignorePatterns,
};
