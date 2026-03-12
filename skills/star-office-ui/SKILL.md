---
name: star-office-ui
description: Use when deploying, repairing, operating, or sharing Star Office UI (pixel office dashboard) for OpenClaw. Covers local startup, state sync, guest agents, public sharing, and common breakages like dead Cloudflare quick tunnels.
---

# Star Office UI

Use this skill when the user wants the pixel office dashboard working, repaired, or shared.

## Where this install lives
Default local repo on this machine:
- `/Users/digigori-ai/.openclaw/tmp/Star-Office-UI`

Treat that repo as the primary working copy unless the user points to another checkout.

## What to do first
1. Check whether the backend is reachable locally.
   - Default URL: `http://127.0.0.1:19000`
2. If not reachable, use the repo above and start/fix it.
3. Only after local success, handle public sharing.

## Standard local startup
From the Star Office UI repo:
```bash
python3 -m pip install -r backend/requirements.txt
cp state.sample.json state.json  # first run only
cd backend
python3 app.py
```

Then verify:
- `http://127.0.0.1:19000`
- `python3 set_state.py writing "..."`
- `python3 set_state.py idle "..."`

## State sync with OpenClaw
Preferred state file / scripts in this environment:
- `set_state.py`
- `state.json`

Typical states:
- `idle`
- `writing`
- `researching`
- `executing`
- `syncing`
- `error`

## Guest agents / extra employees
For extra agents joining the office:
1. Check or edit `join-keys.json`
2. Use `office-agent-push.py`
3. Provide:
   - join key
   - agent name
   - office URL

If the user asks to “add an employee”, you may create a dedicated state file plus a configured copy of `office-agent-push.py` for that role.

## Public sharing
### Quick temporary sharing
Use:
```bash
cloudflared tunnel --url http://127.0.0.1:19000
```

Important:
- `trycloudflare.com` URLs are temporary and die often.
- If the link stops working, create a fresh tunnel.
- Verify the fresh URL from another fetch after creation.

### If sharing OpenClaw Control UI instead of Star Office UI
That is a different service, usually on the OpenClaw gateway port, not `19000`.
Do not confuse the two.

## Common failures
- **Dead Cloudflare URL**: quick tunnel expired; create a new one.
- **Local app down**: backend not running.
- **Employee not showing**: join key invalid, push script stopped, or status source missing.
- **Missing Python module**: install requirements in the correct venv.

## Safety / hygiene
- Prefer local verification before telling the user it works.
- Do not expose private local paths or secrets in public replies.
- If making the service public, remind the user when the link is temporary.

## Read more when needed
Read `references/operations.md` for:
- concrete repo layout
- join-key flow
- employee agent setup
- public tunnel workflow
- known pitfalls from this machine
