import pino from "pino";
import pinoHttp from "pino-http";

// create logs and store in log file
export const logger = pinoHttp({
  logger: pino(
    process.env.ERROR_LOGS === "false"
      ? {
          transport: {
            target: "pino-pretty",
          },
        }
      : {},
    pino.destination("./pino-logger.log")
  ),
});
