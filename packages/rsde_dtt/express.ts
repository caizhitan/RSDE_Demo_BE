import express, { Application } from "express";
import db from "./sqlz-cli/models";
import { routes } from "./routes";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import setupSentry from "@wotm/sentry";

const openAPIOutputFile = path.resolve(__dirname, "./docs/result.yml");

export function expressApp() {
  const corsOptions = {
    credentials: true, // access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: "*",
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Auth-Token",
    ],
  };

  const app: Application = express();
  setupSentry(app);
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "25mb" }));

  db.sequelize.sync();

  app.use(
    express.urlencoded({
      extended: true,
      limit: "25mb",
    })
  );

  const file = fs.readFileSync(openAPIOutputFile, "utf8");
  const swaggerDocs = YAML.parse(file);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use("/", routes(db));

  app.get('/', (req, res) => {
    res.send("Working")
  })

  app.listen(3001)

  return app;
}
