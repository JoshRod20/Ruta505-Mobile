module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/.maestro/"],
  collectCoverageFrom: [
    "src/utils/**/*.js",
    "src/hooks/**/*.js",
    "!src/utils/fonts/**",
  ],
};
