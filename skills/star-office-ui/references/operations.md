# Star Office UI Operations

## Local repo on this machine
- `/Users/digigori-ai/.openclaw/tmp/Star-Office-UI`

Useful files there:
- `SKILL.md`
- `README.ja.md`
- `backend/requirements.txt`
- `set_state.py`
- `state.json`
- `join-keys.json`
- `office-agent-push.py`
- `run_star_office.sh`

## Local URL
Default local Star Office UI URL:
- `http://127.0.0.1:19000`

This is the Star Office dashboard.
Do not confuse it with the OpenClaw Control UI / gateway dashboard on `127.0.0.1:187xx`.

## Startup / repair checklist
1. Confirm repo exists.
2. Confirm Python deps are installed.
3. Confirm `state.json` exists.
4. Start backend from `backend/app.py`.
5. Verify with local HTTP.
6. Test one state change with `set_state.py`.

## Joining employees
`join-keys.json` contains reusable join keys.
Typical flow:
1. choose / create key
2. configure `office-agent-push.py`
3. give the employee a stable name
4. point it at the office URL
5. make sure it has a readable local status source

### Example employee setup pattern
- create `<role>-state.json`
- copy `office-agent-push.py` to `<role>-agent-push.py`
- set:
  - `JOIN_KEY`
  - `AGENT_NAME`
  - `OFFICE_URL`
- run with `OFFICE_LOCAL_STATE_FILE=/path/to/<role>-state.json`

## Public sharing workflow
For temporary public access:
```bash
cloudflared tunnel --url http://127.0.0.1:19000
```

After launch:
1. capture the new `https://*.trycloudflare.com` URL from logs
2. verify it externally
3. send only the new URL
4. if user reports failure later, assume tunnel expiry first

## Known pitfalls on this machine
- `trycloudflare` links expire and caused repeated confusion.
- OpenClaw Control UI sharing is not the same as Star Office UI sharing.
- Some employee scripts needed `requests` installed in the chosen venv.
- The repo currently lives under `.openclaw/tmp`, so the workspace skill should point there explicitly.

## Recommended reply style
When reporting status to the user, be crisp:
- whether local is up
- whether public is up
- the URL to use now
- whether it is temporary or stable
