const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.spec.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
};