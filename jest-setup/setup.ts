module.exports = async function (globalConfig, projectConfig) {
  // mock jsonwebtoken to bypass access token validation
  jest.mock("jsonwebtoken", () => {
    const originalModule = jest.requireActual("jsonwebtoken");

    return {
      ...originalModule,
      verify: jest.fn((jwtString, secretOrPublicKey, options, callback) => {
        const decoded = originalModule.decode(jwtString);
        callback(null, decoded);
      }),
    };
  });
};
