import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "jsdom",  // Use jsdom for a simulated browser environment
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],  // Path to setup file for polyfills and test setup
  extensionsToTreatAsEsm: [".ts", ".tsx"],  // Treat TypeScript files as ESM
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",  // Use @swc/jest to transpile TypeScript
  },
  moduleNameMapper: {
    "^@mui/icons-material/(.*)$": "<rootDir>/node_modules/@mui/icons-material/esm/$1",  // Map MUI imports correctly
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@mui/icons-material)/",  // Allow Jest to transform MUI icon files
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true,  // Enable isolated modules to improve test performance
    },
  },
};

export default config;
