module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config", "<rootDir>/../../jest-setup/setup.ts"],
  modulePathIgnorePatterns: ["/build/"],
  coverageThreshold: {
    "packages/**/routes/*.ts": {
      functions: 80,
    },
  },
};
