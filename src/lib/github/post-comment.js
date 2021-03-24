import { request } from '@octokit/request';

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
  const result = await request({
    method: 'GET',
    // url: '/orgs/{org}/repos',
    url: '/repos/{owner}/{repo}/pulls/{pull_number}',
    headers: {
      authorization: `token ${token}`,
    },
    owner,
    repo,
    pull_number,
  });
  if (!result.data) {
    console.log('no repo found');
    console.log(result);
    return false;
  }
  return result.data;
}

export async function postComment(repoRef, issue, comment, token = GITHUB_TOKEN) {
  const { owner, repo } = getRepoParts(repoRef);
  const result = await request({
    method: 'POST',
    url: '/repos/{owner}/{repo}/issues/{issue_number}/comments',
    headers: {
      authorization: `token ${token}`,
    },
    owner,
    repo,
    issue_number: issue,
    body: comment,
  });
  return result.data;
}
