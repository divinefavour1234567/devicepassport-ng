# DevicePassport NG — fastest deployment path

## What is already in this source
- React/Vite application with device registration, inspection forms, passport records and QR links.
- Pollar React provider and WalletButton in `src/main.tsx` and `src/App.tsx`.
- Browser key is read from `VITE_POLLAR_PUBLISHABLE_KEY`.
- No secret key is included. Do not add a `sec_...` key to VITE variables or frontend files.

## Get a public HTTPS URL (Vercel)
1. Create a GitHub repository named `devicepassport-ng` under your account.
2. Upload the contents of this folder to the repository (not the outer ZIP folder).
3. Open https://vercel.com/new and import that GitHub repository.
4. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
5. In Vercel project settings → Environment Variables, add:
   - Name: `VITE_POLLAR_PUBLISHABLE_KEY`
   - Value: your `pub_testnet_...` key
   Apply to Preview and Production, then redeploy.
6. Copy the deployed HTTPS URL, e.g. `https://your-project.vercel.app`.
7. In Pollar Dashboard → Build → Domains → Allowed origins, add that exact origin and save.
8. Open the deployed site and click the Pollar wallet button. Choose Email/OTP if offered; this avoids OAuth redirect configuration. Complete sign-in.
9. Return to Pollar Dashboard → Users → Wallets and refresh. The end-user wallet should appear if Pollar app funding wallet is active and funded.

## Important Pollar dashboard prerequisites
The official dashboard checklist says:
- API key configured
- Allowed origin configured
- App funding wallet created and funded with enough XLM for wallet creation
- Enable trustlines only if the chosen non-XLM asset requires one
- Install SDK and create the first wallet by authenticating from the app

The Wallets page is a listing, not a manual wallet-creation form. Do not try to create a wallet from its filters.

## OAuth redirect URI
If you choose Google/GitHub OAuth, configure the exact callback URL specified by the Pollar SDK/dashboard for this app before testing. Do not guess a callback. Email OTP is the simplest first test if enabled.

## Demo honesty / hackathon checklist
- Do not claim a payment is real until a Stellar testnet transaction is submitted and its hash/status is independently checked.
- Do not claim technician identity is verified until authentication/verification exists.
- QR codes currently open a passport URL; localStorage records are local to the browser. Public cross-device verification needs a hosted database/API.
- Use testnet only for the hackathon demo.
- Include sponsor/organiser attribution using official supplied logos and wording; do not imply endorsement beyond the event's actual sponsor list.
