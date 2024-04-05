import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

export default function setupSentry(app) {
  // Sentry setup.
  Sentry.init({
    // If SENTRY_DSN env var is not provided, SDK will just not send any events.
    dsn: process.env.SENTRY_DSN,
    // To allow filtering between dev,prod etc. in sentry dashboard
    environment: process.env.SENTRY_ENVIRONMENT,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  // The error handler must be before any other error middleware and after all controllers
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture all 40X and 500 errors
        if (
          error.status === 400 ||
          error.status === 401 ||
          error.status === 403 ||
          error.status === 404 ||
          error.status === 417 ||
          error.status === 500
        ) {
          return true;
        }
        return false;
      },
    })
  );
}
