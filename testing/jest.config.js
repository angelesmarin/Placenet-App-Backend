module.exports = {
    testMatch: [
      "**/controllers/**/*.test.js",
      "**/middleware/**/*.test.js",
      "**/models/**/*.test.js",
      "**/routes/**/*.test.js"
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      "controllers/**/*.js",
      "middleware/**/*.js",
      "models/**/*.js",
      "routes/**/*.js"
    ],
    coverageDirectory: "coverage",
  };
  