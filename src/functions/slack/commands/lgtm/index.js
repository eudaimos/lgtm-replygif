import qs from 'querystring';
import util from 'util';

import runWarm from '../../../../utils/run-warm';
import rollbarHandler, { rollbar } from '../../../../utils/rollbar';
import replyGif, { fetchFromApi, cleanTopic, imageUrlFromNumber } from '../../../../lib/replygif/fetch';
import { getPR, postComment } from '../../../../lib/github/post-comment';
import { getRandomArrayItem } from '../../../../lib/utils/random';

export const lgtm = async function lgtm(event) {
  console.log(event.body); // eslint-disable-line no-console
  rollbar.log(event.body);
  const data = qs.decode(event.body);
  const { command, text, user_id } = data; // eslint-disable-line camelcase
  const ops = text.split(' ').reduce((cur, arg) => {
    const update = cur;
    if (arg.includes('/')) {
      update.repo = arg;
    } else if (arg.includes('pr:')) {
      update.pr = arg.replace('pr:', '');
    } else if (arg.includes('@')) {
      update.subject = arg;
    } else if (!cur.topic && !cur.gif) {
      const gif = +arg;
      if (gif) {
        update.gif = gif;
      } else {
        update.topic = arg;
      }
    }
    return update;
  }, {});
  ops.topic = cleanTopic(ops.topic);
  const pr = await getPR(ops.repo, ops.pr);
  if (!pr) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response_type: 'ephemeral',
        text: `${command} used with repo "${ops.repo}" and PR#${ops.pr} that DNE or bot has no access`,
      }),
    };
  }

  const { user } = pr;
  let image;
  if (ops.gif) {
    image = imageUrlFromNumber(ops.gif);
  } else {
    // const imageUrls = await replyGif(ops.topic);
    const imageUrls = await fetchFromApi(ops.topic);
    image = getRandomArrayItem(imageUrls);
  }
  const comment = `@${user.login}\n\n# LGTM\n\n![](${image})\n\n${ops.gif ? 'as' : 'from'} ${ops.gif || ops.topic}`;
  const commentResult = await postComment(ops.repo, ops.pr, comment);
  console.log(util.inspect(commentResult, false, null, true)); // eslint-disable-line no-console

  /* eslint-disable camelcase */
  let textResponse = '';
  let response_type = 'ephemeral';
  if (!commentResult) {
    textResponse = `${command} used with repo "${ops.repo}" PR#${ops.pr} was unable to post comment`;
  } else {
    const { html_url } = commentResult;
    textResponse = `posted reply to <${html_url}|${ops.repo} PR#${ops.pr}> for <@${user_id}> as \n>*LGTM*\n>${image}`;
    if (ops.subject) {
      textResponse = `${ops.subject}, I ${textResponse}`;
    }
    response_type = 'in_channel';
  }
  /* eslint-enable camelcase */
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      response_type,
      text: textResponse,
    }),
  };

  return response;
};

// Export the hander wrapped in the "run warm" utility which will handle events
// from the scheduler, keeping our actual handler logic clean.
export default rollbarHandler(runWarm(lgtm));
