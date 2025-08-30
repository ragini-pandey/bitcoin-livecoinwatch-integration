# Bitcoin + LiveCoinWatch Integration

Fetch real-time Bitcoin market data from the **LiveCoinWatch** API and expose it for apps, dashboards, or CLI tools. This repo shows a clean, minimal integration with caching, rate-limit safety, and handy examples (curl + frontend fetch).

## ✨ Features

- Pulls **BTC** price, volume, market cap, and change stats from LiveCoinWatch  
- Optional in-memory **cache** to reduce API calls & speed up responses  
- Simple **Express** server with a `/api/btc` endpoint (or use the client directly)  
- Type-safe response shape (if using TS) and graceful error handling  
- Tiny footprint — easy to plug into any project

## 🧱 Tech Stack

- Node.js (≥ 18 recommended)
- Express (for the demo API)
- `node-fetch` or `undici` (HTTP client)
- dotenv (for local env management)

> If your repo differs (pure script / frontend only), keep the env & usage sections; you can remove the Express bits.

---

## 🔑 Prerequisites

1. **LiveCoinWatch API key**  
   Create an account and generate an API key from your dashboard.

2. **Environment variables**  
   Create a `.env` file in the project root:

```bash
LIVECOINWATCH_API_KEY=your_api_key_here
# Optional cache TTL in seconds (default 30)
CACHE_TTL_SECONDS=30
# Optional port for the sample server (default 3000)
PORT=3000
```

---

## 📦 Installation

```bash
# clone
git clone https://github.com/ragini-pandey/bitcoin-livecoinwatch-integration.git
cd bitcoin-livecoinwatch-integration

# install deps
npm install
# or: pnpm i / yarn
```

---

## ▶️ Run

### Start the sample API server

```bash
npm run dev
# or
npm start
```

Server boots on `http://localhost:3000`.

### Try it

```bash
curl http://localhost:3000/api/btc
```

Example response:

```json
{
  "symbol": "BTC",
  "price": 59234.18,
  "marketCap": 1165342345678,
  "volume24h": 23654234567,
  "delta": {
    "hour": -0.12,
    "day": 1.85,
    "week": 5.42
  },
  "timestamp": 1724970000000,
  "cached": true
}
```

> `cached: true` means the response was served from in-memory cache for speed/rate-limit safety.

---

## 🧠 How it works

- On each request, we first check a small in-memory cache keyed by `"BTC"`.
- If stale/missing, we POST to `https://api.livecoinwatch.com/coins/single` with:
  ```json
  {
    "currency": "USD",
    "code": "BTC",
    "meta": true
  }
  ```
- We map the LCW fields to a clean response and store it with a TTL (`CACHE_TTL_SECONDS`).

---

## 🗺️ API (Sample Express Route)

`GET /api/btc`  
Returns normalized BTC data.

**Handler outline (for reference):**
```js
import fetch from "node-fetch";

let cache = { data: null, expiresAt: 0 };
const ttlMs = (process.env.CACHE_TTL_SECONDS || 30) * 1000;

export async function getBtc(req, res) {
  const now = Date.now();
  if (cache.data && cache.expiresAt > now) {
    return res.json({ ...cache.data, cached: true });
  }

  const r = await fetch("https://api.livecoinwatch.com/coins/single", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.LIVECOINWATCH_API_KEY
    },
    body: JSON.stringify({ currency: "USD", code: "BTC", meta: true })
  });

  if (!r.ok) {
    const text = await r.text();
    return res.status(502).json({ error: "Upstream error", detail: text });
  }

  const d = await r.json();
  const normalized = {
    symbol: d.code,
    price: d.rate,            // USD
    marketCap: d.cap,
    volume24h: d.volume,
    delta: {
      hour: d.delta?.hour,
      day: d.delta?.day,
      week: d.delta?.week
    },
    timestamp: Date.now()
  };

  cache = { data: normalized, expiresAt: now + ttlMs };
  res.json({ ...normalized, cached: false });
}
```

---

## 💻 Frontend example

```html
<script>
  async function loadBTC() {
    const res = await fetch("/api/btc");
    const data = await res.json();
    document.getElementById("price").textContent = `$ ${data.price.toLocaleString()}`;
    document.getElementById("deltaDay").textContent = `${data.delta.day}%`;
  }
  loadBTC();
</script>

<div>
  <strong>BTC</strong>
  <div>Price: <span id="price">—</span></div>
  <div>24h: <span id="deltaDay">—</span></div>
</div>
```

---

## 🔬 Testing (optional)

```bash
npm test
```

> Add simple tests around the mapper and cache timing (mock `fetch`).

---

## ⚙️ Scripts

Common scripts you might find/use in this repo:

```jsonc
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "lint": "eslint .",
    "test": "vitest"
  }
}
```

---

## 🛡️ Rate limits & reliability

- Respect LiveCoinWatch rate limits; keep caching turned on (`CACHE_TTL_SECONDS` ≥ 15–30s is typical).
- Exponential backoff or retry-once on 5xx can be added if you see transient errors.
- Never ship your API key to the browser; route calls through your server.

---

## 🧩 Project structure

```
.
├─ server.js            # Express bootstrap
├─ routes/
│  └─ btc.js            # /api/btc handler (integration + cache)
├─ lib/
│  └─ livecoinwatch.js  # API client (fetch wrapper + mapping)
├─ .env.example
├─ package.json
└─ README.md
```

> Your actual layout may vary—this is a suggested structure.

---

## 🚀 Deploy

- **Render/Heroku/Vercel**: set `LIVECOINWATCH_API_KEY`, `CACHE_TTL_SECONDS`, and `PORT` in dashboard env vars.
- Ensure the server route is reachable (Vercel → use `api/` functions or run as Node server).

---

## ❓ Troubleshooting

- **401/403**: Check `LIVECOINWATCH_API_KEY` is set and valid.
- **CORS**: If calling from the browser directly to your server, enable CORS for your domain.
- **NaN price**: Validate the API response; sometimes fields can be missing during upstream incidents—handle fallbacks.

---

## ✅ Checklist

- [ ] Create `.env` with `LIVECOINWATCH_API_KEY`
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Hit `GET /api/btc` and verify output
- [ ] Wire into your frontend/dashboard
