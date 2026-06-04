/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  // @mistralai/mistralai and ollama ship ESM — transform them through ts-jest
  transformIgnorePatterns: [
    "node_modules/(?!(@mistralai/mistralai|ollama)/)",
  ],
  transform: {
    "^.+\\.(ts|js)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
