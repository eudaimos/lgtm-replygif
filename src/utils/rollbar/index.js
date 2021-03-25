import Rollbar from 'rollbar';
import RollbarLocals from 'rollbar/src/server/locals';
import { config, enabled } from './config';

if (!enabled) {
  console.log('rollbar not enabled - returning dummy implementation');
}

const NOOP = () => {};

// const { ROLLBAR_ACCESS_TOKEN } = process.env;

// initialize Rollbar
const rollbar = enabled ? new Rollbar({
  ...config,
  locals: RollbarLocals,
}) : {
  log: NOOP,
  error: NOOP,
  debug: NOOP,
  warning: NOOP,
  info: NOOP,
  captureEvent: NOOP,
};

const rollbarHandler = (handler) => (
  enabled ? rollbar.lambdaHandler(handler) : handler
);

export { rollbar };

export default rollbarHandler;
