# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## About This Repo

**15-Days AI Automation** — Logan ka learning journey. Har din ek project, ek concept. Goal: AI Engineer banna.

Logan: 24-year-old frontend developer (2+ saal experience), Node.js/APIs/databases aate hain, GenAI basics bhi. 12th abhi poori nahi hui.

---

## Claude ke liye rules ⚠️

1. **Hamesha simple Hinglish** mein baat karo. Koi technical word aaye to pehle ek line mein aam bhasha mein samjhao.
2. **Example pehle, theory baad mein.**
3. **Poora code mat do.** Pehle steps aur hints. Logan ataak jaaye aur maange, tabhi code do — chhote tukdon mein.
4. **Code review** karo jaise senior developer karta hai: kya sahi, kya galat, aur kyu.
5. Har project ke end mein **2–3 interview sawaal** us topic se.
6. **Short jawab.** Logan zaroorat ho to aur poochhega.
7. Galat ho to seedha batao, lekin pyaar se.
8. Skip kiya to judge mat karo, wahin se continue karo.

---

## Tech Stack

| Kaam | Tool |
|---|---|
| Language | Node.js + TypeScript |
| AI | `@anthropic-ai/sdk` ya OpenAI SDK |
| Validation | `zod` |
| Database | SQLite (`better-sqlite3`) |
| Server | `express` |
| Scheduling | `node-cron` |
| Email | `nodemailer` |
| Queue | `bullmq` + Redis |
| MCP | `@modelcontextprotocol/sdk` |
| Testing | Vitest |
| Logging | `pino` |
| Code quality | ESLint + Prettier |
| Deploy | Docker + Railway / Render |

**AI model hardcode mat karo.** `.env` mein `AI_MODEL` rakho.

---

## Repo Structure

```
gen-ai/
├── CLAUDE.md
├── .env.example          # API keys ka format only, real keys kabhi nahi
├── shared/
│   └── llm.ts            # Day 4 ka retry wrapper — har project yahi use karta hai
├── day-01-contact-extractor/
│   ├── index.ts
│   └── LEARNINGS.md
├── day-02-*/
│   ├── index.ts
│   └── LEARNINGS.md
└── ...
```

Har `LEARNINGS.md` mein sirf 3 lines: kya seekha / kya toota / kaise theek kiya.

---

## Commands

Har day ke folder mein ye scripts honi chahiye (`package.json`):

```bash
npm run dev          # ts-node se run karo
npm run build        # TypeScript compile
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run test         # Vitest
npm run test -- path/to/file.test.ts  # single test file
```

Root level pe `package.json` nahi — har day ka apna isolated `package.json`.

---

## Architecture Notes

### `shared/llm.ts` — The Core Wrapper (Day 4+)
Day 4 ke baad **har project** `shared/llm.ts` import karta hai directly ya copy karke. Yeh wrapper:
- Exponential backoff retry karta hai (1s → 2s → 4s)
- Rate limit errors pe retry, auth errors pe nahi
- Har call ka time aur token count log karta hai
- 30s timeout enforce karta hai

### Agent Loop Pattern (Day 9+)
AI → tool call → result → AI → ... loop, **max steps cap** ke saath (infinite loop se bachne ke liye). Har step console pe print hoga. Koi framework nahi — yeh pattern samajhna zaroori hai.

### Environment Variables
`.env` file har day ke folder mein ya root pe. Required keys:
```
AI_MODEL=           # e.g. claude-opus-4-5
ANTHROPIC_API_KEY=
```

---

## Security Rules

- `.env` kabhi commit nahi — `.gitignore` mein hamesha.
- Sirf `.env.example` commit karo (empty values ke saath).
- Agent ko destructive actions (send, delete, payment) bina explicit approval ke mat karne do.
- Prompt injection test karo Day 13 mein — input validation zaroori hai.
