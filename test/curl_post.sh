#!/usr/bin/env bash

repo_ref=eudaimos/repo-for-demo

curl -X POST --data-urlencode "command=/lgtm" \
  --data-urlencode "text=<@U01RSEK89RU|demo-slack> pr:2 ${repo_ref} agreeing -replyapi" \
  --data-urlencode "user_id=U01RW5SSVNZ" \
  --data-urlencode "user_name=jeff" \
  http://localhost:3000/dev/slack/lgtm | jq .

# curl -X POST --data-urlencode "command=/lgtm" \
#   --data-urlencode "text=<@U01RSEK89RU|demo-slack> pr:1 ${repo_ref} agreeing -undef" \
#   --data-urlencode "user_id=U01RW5SSVNZ" \
#   --data-urlencode "user_name=jeff" \
#   http://localhost:3000/dev/slack/lgtm | jq .

# curl -X POST --data-urlencode "command=/lgtm" \
#   --data-urlencode "text=<@U01RSEK89RU|demo-slack> pr:1 ${repo_ref} agreeing -skippr" \
#   --data-urlencode "user_id=U01RW5SSVNZ" \
#   --data-urlencode "user_name=jeff" \
#   http://localhost:3000/dev/slack/lgtm | jq .

# curl -X POST --data-urlencode "command=/lgtm" \
#   --data-urlencode "text=<@U01RSEK89RU|demo-slack> pr:88 ${repo_ref} agreeing -skippr" \
#   --data-urlencode "user_id=U01RW5SSVNZ" \
#   --data-urlencode "user_name=jeff" \
#   http://localhost:3000/dev/slack/lgtm | jq .

# curl -X POST --data-urlencode "command=/lgtm" \
#   --data-urlencode "text=<@U01RSEK89RU|demo-slack> pr:88 ${repo_ref} agreeing" \
#   --data-urlencode "user_id=U01RW5SSVNZ" \
#   --data-urlencode "user_name=jeff" \
#   http://localhost:3000/dev/slack/lgtm | jq .

# curl -X POST --data-urlencode "command=/lgtm" \
#   --data-urlencode "text=<@U01RSEK89RU|demo-slack> pr:1 ${repo_ref} 159" \
#   --data-urlencode "user_id=U01RW5SSVNZ" \
#   --data-urlencode "user_name=jeff" \
#   http://localhost:3000/dev/slack/lgtm | jq .
