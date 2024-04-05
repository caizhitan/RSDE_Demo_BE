import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Initialize a client to fetch the public keys from Azure AD. Signing keys will be cached by default.
const client = jwksClient({
  jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
});

/**
 * Verify the validity of Azure access token by verifying its signature and decoding its contents.
 * @param {string} accessToken - The access token to be verified.
 */
const verifyAccessToken = (accessToken: string, callback) => {
  function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  }

  const options = {
    audience: process.env.APP_ID_URI,
    issuer: `https://sts.windows.net/${process.env.TENANT_ID}/`,
  };

  jwt.verify(accessToken, getKey, options, callback);
};

export function azureJwtVerify(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  verifyAccessToken(token, (err, decoded) => {
    if (err) {
      return res.status(401).send(err);
    }

    res.locals.user = decoded;
    next();
  });
}

/**
 * Tries to authorise user if token provided. If not token provided, still allow user access.
 * However, throw error if error verifying token.
 * Useful for endpoints that allow public and authorised users.
 * @param req
 * @param res
 * @param next
 */
export function optionalAzureJwtVerify(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return next();

  const token = authHeader.split(" ")[1];

  verifyAccessToken(token, (err, decoded) => {
    if (err) {
      return res.status(401).send(err);
    }

    res.locals.user = decoded;
    next();
  });
}
