import cheerio from 'cheerio';
import got from 'got';

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
  const requestUrl = `${REPLYGIF_API_URL}gifs?tag=${topic}&${REPLYGIF_API_KEY}`;
  const body = await got(requestUrl, { responseType: 'json' }).json();
  if (!body) {
    return [];
  }
  return body.map((img) => img.file);
}

export const fetch = async function fetch(topic) {
  const response = await got(`${REPLYGIF_URL}/t/${topic}`);
  const $ = cheerio(response.body);
  // const $ = cheerio.load(response.body);
  const imageUrls = [];
  // $('div.image-container a').each((i, div) => {
  //   if (!i) console.log(div.attribs.href);
  // });
  $('div.image-container a').each((i, anchor) => {
    const gifPath = anchor.attribs.href;
    imageUrls.push(imageUrlFromPath(gifPath));
  });
  return imageUrls;
};

export default fetch;
