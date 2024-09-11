module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.ts"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["**/*.{ts,js}"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
};
