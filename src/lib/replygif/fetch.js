import cheerio from 'cheerio';
import got from 'got';
import { rollbar } from '../../utils/rollbar';

const REPLYGIF_URL = 'http://replygif.net';
const REPLYGIF_API_URL = 'http://replygif.net/api/';
const REPLYGIF_API_KEY = 'api-key=39YAprx5Yi';

const ALLOWED_TOPICS = [
  'thumbs-up',
  'agreeing',
  'nod',
  'happy',
  'approval',
  'okay',
];

export function cleanTopic(topic = '') {
  return ALLOWED_TOPICS.includes(topic) ? topic : ALLOWED_TOPICS[0];
}

export function imageUrlFromPath(path) {
  return `${REPLYGIF_URL}/i${path}.gif`;
}

export function imageUrlFromNumber(gif) {
  return imageUrlFromPath(`/${gif}`);
}

export async function fetchFromApi(topic) {
  const start = Date.now();
  try {
    const requestUrl = `${REPLYGIF_API_URL}gifs?tag=${topic}&${REPLYGIF_API_KEY}`;
    const body = await got(requestUrl, { responseType: 'json' }).json();
    if (!body) {
      return [];
    }
    return body.map((img) => img.file);
  } catch (err) {
    const end = Date.now();
    const { response } = err;
    rollbar.captureEvent('network', {
      subtype: 'fetch',
      url: response.requestUrl,
      status_code: response.statusCode,
      request: response.request.body,
      request_headers: response.request.headers,
      method: response.request.method,
      response: {
        body: response.body,
        headers: response.headers,
      },
      start_time_ms: response.timings.start,
      end_time_ms: response.timings.end,
    }, 'error');
    throw err;
  }
}

export const fetch = async function fetch(topic, errorOut = false) {
  const response = await got(`${REPLYGIF_URL}/t/${topic}`);
  let $;
  if (!errorOut) {
    $ = cheerio.load(response.body);
  } else {
    $ = cheerio(response.body);
  }
  const imageUrls = [];
  $('div.image-container a').each((i, anchor) => {
    const gifPath = anchor.attribs.href;
    imageUrls.push(imageUrlFromPath(gifPath));
  });
  return imageUrls;
};

export default fetch;
