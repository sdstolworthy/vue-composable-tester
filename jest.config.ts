import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**.ts"],
};
export default config;
