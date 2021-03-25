import util from 'util';
import { request } from '@octokit/request';
import { rollbar } from '../../utils/rollbar';

const { GITHUB_TOKEN } = process.env;

function getRepoParts(repoRef) {
  const [owner, repo] = repoRef.split('/');
  return { owner, repo };
}

// eslint-disable-next-line import/prefer-default-export
export async function getRepo(repoRef, token = GITHUB_TOKEN) {
  const { owner, repo } = getRepoParts(repoRef);
  const result = await request({
    method: 'GET',
    // url: '/orgs/{org}/repos',
    url: '/repos/{owner}/{repo}',
    headers: {
      authorization: `token ${token}`,
    },
    owner,
    repo,
    // type: 'all',
  });
  if (!result.data) {
    console.log('no repo found');
    console.log(result);
    return false;
  }
  return result.data;
}

// eslint-disable-next-line import/prefer-default-export, camelcase
export async function getPR(repoRef, pull_number, token = GITHUB_TOKEN) {
  const { owner, repo } = getRepoParts(repoRef);
  const headers = {};
  if (token) {
    headers.authorization = `token ${token}`;
  }
  const start = Date.now();
  try {
    const result = await request({
      method: 'GET',
      url: '/repos/{owner}/{repo}/pulls/{pull_number}',
      headers,
      owner,
      repo,
      pull_number,
    });
    if (result && result.data) {
      return result.data;
    }
    console.log('no repo found');
    console.log(result);
  } catch (err) {
    const end = Date.now();
    rollbar.captureEvent('network', {
      subtype: 'fetch',
      url: err.request.url,
      status_code: err.status,
      request: err.request.body,
      request_headers: err.request.headers,
      method: err.request.method,
      response: {
        body: err.body,
        headers: err.headers,
      },
      start_time_ms: start,
      end_time_ms: end,
    }, 'error');
    console.error(err);
    if (err.status === 404) {
      return null;
    }
    throw err;
  }
  return null;
}

export async function postComment(repoRef, issue, comment, token = GITHUB_TOKEN) {
  const { owner, repo } = getRepoParts(repoRef);
  const headers = {};
  if (token) {
    headers.authorization = `token ${token}`;
  }
  const start = Date.now();
  try {
    const result = await request({
      method: 'POST',
      url: '/repos/{owner}/{repo}/issues/{issue_number}/comments',
      headers,
      owner,
      repo,
      issue_number: issue,
      body: comment,
    });
    return result.data;
  } catch (err) {
    const end = Date.now();
    rollbar.captureEvent('network', {
      subtype: 'fetch',
      url: err.request.url,
      status_code: err.status,
      request: err.request.body,
      request_headers: err.request.headers,
      method: err.request.method,
      response: {
        body: err.body,
        headers: err.headers,
      },
      start_time_ms: start,
      end_time_ms: end,
    }, 'error');
    console.error(err);
    // console.log(util.inspect(err, false, null, true));
    throw err;
  }
}
