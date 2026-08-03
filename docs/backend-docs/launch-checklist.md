# Launch checklist — APIs ready

Use this to sign off before the frontend flips `NEXT_PUBLIC_MOCK_MODE=false`.

## P0 must work

- [ ] `GET /properties` with filters + `limit`; empty `[]`
- [ ] `GET /properties/{slug}` published detail; missing → 404 or null
- [ ] `GET /posts` + `GET /posts/{slug}` (sections may be `[]`)
- [ ] `GET /team` + `GET /services`
- [ ] `POST /contact` → `{ "ok": true }`; 422 validation; 429 rate limit
- [ ] `GET /legal/privacy` + `GET /legal/terms` (or empty-safe null / empty sections)
- [ ] Absolute HTTPS image URLs with width/height/alt
- [ ] camelCase JSON matching [resources.md](./resources.md)
- [ ] `Accept-Language: ar` returns Arabic strings
- [ ] Drafts / soft-deletes never in public responses
- [ ] CORS allows marketing origin for contact POST
- [ ] Staging base URL documented for frontend env

## P1 nice-to-have before launch

- [ ] `GET /team/{slug}`, `GET /services/{slug}`
- [ ] `Cache-Control` on public GETs
- [ ] Seed at least one property, one post, legal docs (or accept empty UI)

## P2 can follow after go-live

- [ ] `GET /faqs`
- [ ] `GET /settings`
- [ ] `GET /home` (hero image/copy)
- [ ] `GET /seo/{pageKey}`

## Smoke with frontend

1. Point `NEXT_PUBLIC_API_URL` at staging; set mock mode **off**.
2. Home / properties / property detail / blog / article / services / team / contact / privacy / terms.
3. Confirm empty DB still renders empty states (no white screens).
4. Submit contact form; see Filament inbox / mail.
5. Sitemap builds (frontend pulls property + post + legal dates from API).

## Contract freeze

After P0 sign-off, treat field names and enums as **frozen**. Additive fields are OK; renames need a coordinated frontend release.
