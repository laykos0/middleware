const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  modulePathIgnorePatterns: ["/dist/__tests__/", "/dist/__mocks__/"],
  transform: {
    ...tsJestTransformCfg,
  },
};