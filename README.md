# QIVENTRA

<p align="center">
  <img alt="QIVENTRA" src="public/brand/qiventra-full.webp" width="320" />
</p>

<p align="center">
  <strong>A portfolio demo of neighborhood commerce and delivery in Tel Aviv, in Hebrew (RTL), English and Russian.</strong><br />
  Everything runs in the browser: no server, no real sign-in, and no payment is taken.
</p>

**Demo:** https://qiventra-local-commerce-delivery-pl.vercel.app/

The interface follows the “Collage” design system described in [docs/design-collage.md](docs/design-collage.md).

## What you can do

| Area | What happens |
| :--- | :--- |
| **Address** | Pick one of 18 demo addresses. Distance to each shop is worked out from coordinates, and delivery times, the “closest” sort and the count of nearby shops all follow it. A shop out of its delivery radius stays visible but cannot be ordered from, and says what to do. |
| **Catalog** | Shops and products, category and label filters, search across all three languages, suggestions built from the data. |
| **Products** | Variants with their own prices on six products: weight, volume, bouquet size, cup color. Each variant is its own basket line. |
| **Basket** | Each shop charges its own fee and has its own minimum. Shop promotions and promo codes are worked out in one function, `calculateOrder`. The demo code `START20` takes 20 ₪ off orders from 80 ₪, and the buyer gets whichever is worth more, the code or the promotions. |
| **Order** | Delivery window, order page, history with an active/delivered filter, repeat with the same variants. |
| **Tracker and courier** | The tracker stops at “Delivered”. The courier workspace moves the same order along, with a route diagram drawn from the demo coordinates. Both stay in sync across tabs of one browser. |
| **Seller** | Promotions by type, schedule and scope, plus fixed product labels. |
| **Favorites** | Hearts on shops and products, listed in the profile, kept in `localStorage`. |
| **PWA** | Installable, with a service worker that keeps the interface working offline. |

Roles and sign-in are a demonstration: every workspace says so at the top, and nothing checks permissions.

## Addresses

`/`, `/shops`, `/shops/:storeId`, `/shops/:storeId/products/:productId`, `/cart`, `/delivery`, `/orders`, `/orders/:orderId`, `/search?q=`, `/profile`, `/vendor`, `/courier`, `/admin`, `/privacy`, `/terms`, `/accessibility`.

Every address opens directly and survives a reload. `vercel.json` sends them all to `index.html`.

## Stack

React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, vite-plugin-pwa, Vitest. Supabase is optional and is used only by the logo manager in the admin workspace, which loads it on demand.

## Running it

```bash
bun install
bun run dev
```

The app opens on http://localhost:3000. It needs no environment variables. To connect the logo manager to your own Supabase project, copy `.env.example` to `.env.local` and fill it in.

```bash
npx tsc --noEmit
npx vitest run
npx vite build
```

GitHub Actions runs these three on every push and pull request.

`node scripts/generate-thumbnails.js` remakes the 480 px photo copies in `public/photos/480`.

## Supabase and security

The client holds only the public URL and anon key, from environment variables. The `service_role` key must never reach it. Access to brand assets is enforced by row level security in the database, not by the demo roles in the interface.

### Applying the security migration

`supabase/migrations/20261107000000_is_admin_app_metadata_only.sql` fixes `is_admin()`, which used to trust `user_metadata.role`. Any signed-in user can write `user_metadata` from the client, so any user could have made themselves an administrator. It now reads only `app_metadata.role`, which can be written only with the `service_role` key.

It has not been applied to any live database. To apply it:

1. Find out who is an administrator today. Those users lose access until step 3, so plan for that.
2. Run the migration: `supabase db push`, or paste the file into the SQL editor of the Supabase dashboard.
3. Grant the role on the server, for each administrator:

   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
   WHERE email = 'admin@example.com';
   ```

4. Sign in again, because the role travels in the JWT, and check that a user with `role: admin` only in `user_metadata` can no longer upload a logo.

### Logo versions

Each uploaded version keeps its own file under `qiventra/history/`, so `storage_path` stays unique and uploading twice does not fail. The live file stays at one fixed address. A rollback puts the old version's file back at that address before changing any record, so a missing file leaves everything as it was.

## Project layout

```
src/
  data/        Pure logic: cartRules, promotions, addresses, variants, orderTracker, search
  router/      Address table, tab titles, page shell
  pages/       One file per screen
  components/  Collage building blocks, layout, dialogs
  context/     App, language, theme and toast state
  i18n/        All text, in three languages
  services/    Chat (local), media (local), Supabase
  tests/       Vitest, against the real code
supabase/      Migrations and schema notes
```

## Known limits

- The Hebrew was not written by a native speaker and has not been proofread.
- It has not been tested with screen readers or by people with disabilities. See `/accessibility` for what was checked.
- All state lives in one browser. Nothing is shared between devices.

## Credits

Created by JonikStyle Production. © All rights reserved.
