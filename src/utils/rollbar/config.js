const { sourceMaps } = require('../../../babel.config');

const { ROLLBAR_ACCESS_TOKEN } = process.env;

const config = {
  accessToken: ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  includeItemsInTelemetry: true,
  autoInstrument: {
    network: true,
    networkResponseHeaders: true,
    networkResponseBody: true,
    networkRequestBody: true,
    log: true,
    dom: false,
    navigation: false,
    connectivity: true,
    contentSecurityPolicy: true,
    errorOnContentSecurityPolicy: false,
  },
};

const enabled = !!sourceMaps && !!ROLLBAR_ACCESS_TOKEN;

export { config, enabled };
