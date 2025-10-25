## Free Drink Redeem (Next.js)

Mobile-first microsite with a slide-to-redeem interaction.

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Customize

- Replace the cup placeholders in `app/page.tsx` and `app/redeemed/page.tsx` with your animated components.
- Replace the logo placeholder at the bottom ("webe cafe"). The left round shape can be swapped for your SVG/image.

## Backend (Coupons)

Prisma + Postgres (Vercel Postgres free tier). Model:

```
model Coupon {
  code       String   @id @db.Char(8)
  createdAt  DateTime @default(now())
  redeemedAt DateTime?
}
```

Endpoints:
- `GET /api/coupons/status?code=XXXXYYYY` → `{ exists, redeemed }`
- `POST /api/coupons/redeem` with JSON `{ code }` → 200 on success, 404 not found, 409 already redeemed.

Generate coupons locally:
```bash
# set envs
export DATABASE_URL=...    # Vercel Postgres
export BASE_URL=http://localhost:3000
export COUNT=10

npm run prisma:generate
npx prisma migrate dev --name init  # first run locally
npm run gen
```

Deploy on Vercel:
- Add `DATABASE_URL` env var
- Add `npm run prisma:migrate` as build hook or run migration once with `prisma migrate deploy`



