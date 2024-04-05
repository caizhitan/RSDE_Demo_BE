import http from "http";
import path from "path";
import loadDocs from "@wotm/postman-loader";

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const startServer = async () => {
  // const module = await import("@wotm/env/load-env");
  // const RSDE_DTT_ENV_SECRET = process.env.RSDE_DTT_SM_ENV_SECRET;
  // await module.loadEnvs(RSDE_DTT_ENV_SECRET!);
  const config = require("config");
  const module1 = await import("./express");
  const DEFAULT_PORT = config.get("port") as number;
  if (
    config.get("postmanCollectionId") &&
    config.get("postmanCollectionAccessKey")
  )
    await loadDocs(
      `https://api.postman.com/collections/${config.get(
        "postmanCollectionId"
      )}?access_key=${config.get("postmanCollectionAccessKey")}`,
      path.resolve(__dirname, "./docs/result.yml"),
      path.resolve(__dirname, "./docs/options.js")
    );
  const server = http.createServer(module1.expressApp());
  console.log("<<<<<<< DEFAULT_PORT >>>>>", DEFAULT_PORT);
  server.listen(DEFAULT_PORT, () => console.log("running on ", DEFAULT_PORT));
};

startServer();
