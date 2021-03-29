# LGTM ReplyGif

Test project presented at DevOps.js

## Slack App

LGTM ReplyGif is a Slack App that responds to the `/lgtm` slack command.

The App takes a reference to a Github repo and a PR and posts an `LGTM` comment
to the PR on behalf of the summoning user (not really it only currently works for
the user that authorizes it) with an `@` tag of the PR's author.

After posting a comment to the Github PR, it posts a message into the same
Slack Channel and will `@` message someone identified in the command (intended
to be the person who requested your review of the PR).

## Command Args

The arguments are delimeted and can be put in any order:

- `owner/repo` - including a `/` will identify which Github repo using the owner and repo name
- `pr:#` - identifies which PR to comment to in the repo
- `@user` - identifies which user to tag in the following Slack message
- `text|number` - control the image selection from replygif.net
  - `text` - must be an allowed tag, one of 'thumbs-up', 'agreeing', 'nod', 'happy', 'approval', 'okay'
  - `number` - select a specific gif by its number
