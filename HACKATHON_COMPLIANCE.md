# BlockchainUNN × Pollar Hackathon compliance checklist

This checklist is based on the BlockchainUNN announcement screenshot supplied by the team.

## Published requirements

- Registration/submission: use the Boundsless `Build with Pollar` hackathon page. The announcement says this registration is separate from BlockchainUNN's ZCash event registration.
- Eligibility: individual entrants or teams of up to five.
- Prize pool: $300 in stablecoins for the top three projects ($150 / $100 / $50).
- Judging: Pollar SDK technical implementation 30%; problem relevance 25%; demo quality 25%; clarity 20%.
- Announced submission deadline: 14 November 2026, 10:00 UTC (11:00 WAT).
- Announced results: 14 November 2026, 19:00 UTC (20:00 WAT). The source screenshot labels 19:00 UTC as 7pm WAT, which is inconsistent with Nigeria's UTC+1 offset; confirm the organizer's intended local time.

## Project alignment

- Problem relevance: used-device buyers need trustworthy, portable inspection evidence before paying. The product must explain that an inspection report is an attestation by the named inspector, not an automatic guarantee that a device is fault-free.
- Pollar technical implementation: the product has a clearly defined inspection-payment workflow. The current prototype labels Pollar as pending; this is not sufficient for a final submission judged on actual SDK implementation. Before claiming compliance, integrate and demonstrate a real supported Pollar SDK flow on the configured test network, and verify the transaction server-side.
- Demo quality: demonstrate device registration, inspection request, technician checklist, passport creation, QR scan/verification and the Pollar transaction flow end-to-end. Current prototype covers only the local front-end portion and must be described accurately.
- Clarity: explain the target user (buyer of a second-hand phone), the risk (hidden defects and unverifiable seller claims), and the output (portable inspection record).

## Event and partner attribution

The announcement artwork visibly identifies Blockchain University of Nigeria / BlockchainUNN and Pollar. The accompanying event artwork also visibly includes the phrase/logo “Intelligence Without Borders”. The app footer includes text attribution to those event identities. This is event attribution, not a claim that each entity is a project sponsor or has endorsed DevicePassport NG. Use official logo files only if organizers provide or approve them; do not redraw, distort or imply a commercial partnership.

## Submission gate — do not claim complete until checked

- [ ] Team registered on the correct Boundsless hackathon page.
- [ ] Team size is within the published limit.
- [ ] Pollar SDK is genuinely integrated and working in the demo; no simulated payment represented as real.
- [ ] Full end-to-end demo tested on a clean browser/device.
- [ ] Demo data and prototype limitations disclosed.
- [ ] Final project URL, repository, demo video and description (if requested by the submission form) supplied.
- [ ] Organizer confirms any additional branding, logo, or collateral requirements not visible in the announcement screenshot.
