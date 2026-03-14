## Free Drink Redeem

Mobile-first Next.js microsite for redeeming one-time drink coupons.

### Stack

- Next.js 14 App Router
- Upstash Redis via Vercel Marketplace or local env vars
- REST-based Redis access, no generated client or ORM

### Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Set these env vars locally:

```bash
export UPSTASH_REDIS_REST_URL=...
export UPSTASH_REDIS_REST_TOKEN=...
export BASE_URL=http://localhost:3000
export COUNT=10
```

Optional:

```bash
export COUPON_TTL_SECONDS=14400
```

If `COUPON_TTL_SECONDS` is set, generated coupons expire automatically and redeemed markers expire with the same remaining TTL.

### Coupon API

- `GET /api/coupons/status?code=XXXXYYYY` returns `{ exists, redeemed }`
- `POST /api/coupons/redeem` with JSON `{ code }` returns:
  - `200` on success
  - `404` if the code does not exist or has expired
  - `409` if the code was already redeemed

### Generate coupons

```bash
npm run gen
```

Production-oriented batch:

```bash
BASE_URL=https://your-domain.vercel.app COUNT=50 npm run gen:prod
```

Both scripts write coupon records to Redis and print CSV-style lines:

```text
CODE1234,https://your-domain.vercel.app/?c=CODE1234
```

### Deploy on Vercel

1. Add Upstash Redis from the Vercel Marketplace, or manually set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
2. Set `BASE_URL` to your public site URL if you use the generation scripts in Vercel or CI.
3. Deploy normally. No Prisma generation, migrations, or SQL database setup is required.

### Notes

- Coupon validity is stored in Redis keys.
- Redemption is atomic using a Redis Lua script, so duplicate redeems are rejected even under concurrent requests.
- This repo intentionally avoids storing secrets in committed `.env` files. Use `.env.local`, Vercel env vars, or `vercel env pull`.
