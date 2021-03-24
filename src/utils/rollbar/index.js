import Rollbar from 'rollbar';
import RollbarLocals from 'rollbar/src/server/locals';

const NOOP = () => {};

const { ROLLBAR_ACCESS_TOKEN } = process.env;

// initialize Rollbar
const rollbar = ROLLBAR_ACCESS_TOKEN ? new Rollbar({
  accessToken: ROLLBAR_ACCESS_TOKEN,
  // captureUncaught: true,
  // captureUnhandledRejections: true,
  locals: RollbarLocals,
}) : {
  log: NOOP,
  error: NOOP,
  debug: NOOP,
  warning: NOOP,
  info: NOOP,
};

const rollbarHandler = (handler) => (
  ROLLBAR_ACCESS_TOKEN ? rollbar.lambdaHandler(handler) : handler
);

export { rollbar };

export default rollbarHandler;
