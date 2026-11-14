# DevicePassport NG

A hackathon MVP concept for portable, verifiable used-device inspection records in Nigeria.

## Current prototype

- Register devices and create unique passport IDs.
- Search device inventory.
- Record a structured inspection checklist.
- Generate a QR code that opens a passport URL containing the passport ID.
- View condition summary and export the record as JSON.
- Local browser persistence using `localStorage`.
- Pollar React SDK provider and wallet UI are wired for Stellar testnet using the publishable key from `.env.local`. The actual fee payment and server-side transaction verification are not yet implemented.

## Important demo limitations

This is a front-end prototype, not a production verification system. Device records and reports are stored in the browser on the current device only. Inspection results are entered by the operator; no hardware diagnostic is performed. Technician identity is not authenticated, reports are not cryptographically signed, QR URLs are not yet backed by a public verification API, and payments are not live. Seed data and the demo technician must not be represented as real verified records.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
```

## Next implementation milestones

1. Add a backend database and public read-only passport verification endpoint.
2. Add real technician accounts, identity checks, role permissions and immutable audit events.
3. Capture evidence (photos, diagnostic screenshots, consent and timestamps) and hash evidence server-side.
4. Integrate Pollar using the current official SDK documentation: authenticate wallet, request/collect inspection fee on the supported test network, and store verified transaction references server-side. Never trust a client-provided payment success flag.
5. Sign inspection reports server-side using an authenticated technician identity; publish report hash and signature verification endpoint.
6. Add tests, rate limits, privacy controls, data retention and production deployment.

## Pollar configuration

Copy `.env.example` to `.env.local` and set `VITE_POLLAR_PUBLISHABLE_KEY`. The current publishable testnet key has been placed in the local `.env.local` file for this working copy; `.env.local` is gitignored and must not be included in public commits. Keep the rotated secret key exclusively in a backend environment variable such as `POLLAR_SECRET_KEY`. Never place it in a VITE_ variable or browser code.

## Hackathon compliance status (read before presenting)

The supplied BlockchainUNN announcement sets these judging weights: Pollar SDK technical implementation 30%, problem relevance 25%, demo quality 25%, clarity 20%. It permits individuals or teams of up to five and directs participants to the Boundsless `Build with Pollar` submission page (separate from the ZCash event registration).

**This repository is currently a front-end prototype and is not yet a fully compliant final submission.** Pollar testnet provider and wallet UI are integrated, but the inspection-fee payment flow is not implemented or tested; no inspection payment is currently real. Public QR verification currently resolves only within the same local browser data store, not a hosted authoritative database. Technician identity and report signatures are not verified. Do not describe demo seed records as real inspections.

The announcement screenshot states a submission deadline of 14 November 2026 at 10:00 UTC (11:00 WAT). Check the live Boundsless portal and organizer announcements for any extension before submitting. The screenshot's results-time conversion is internally inconsistent, so confirm it with the organizer.


See [DEPLOY_NOW.md](./DEPLOY_NOW.md) for the shortest Vercel + Pollar testnet setup.
