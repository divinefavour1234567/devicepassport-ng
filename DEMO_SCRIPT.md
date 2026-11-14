# DevicePassport NG — 3-minute demo

## The problem
A buyer of a second-hand phone often has to trust the seller's description. The device's condition and repair history are difficult to carry from one transaction to another. A regulator IMEI check is useful, but it is not a physical-condition inspection.

## Demo flow
1. Open Overview and point out the dashboard counts. State that the two starting records are sample data.
2. Open Devices and register a sample phone. Explain that registration creates an identifier, not a verified condition claim.
3. Open Inspections and record battery, screen, camera, charging-port and network checks. Explain that a real technician must perform and attest to these checks.
4. Open Passports and select the newly inspected phone. Show its QR code, passport ID and inspection summary.
5. Export the JSON record. Explain that the next milestone is a hosted verification endpoint so another buyer can scan the QR and retrieve the signed record.
6. Show the Pollar integration panel. Explain the planned flow: the buyer requests an inspection, pays the inspection fee using the supported Pollar wallet/payment flow on testnet, and the backend stores the confirmed transaction reference against the inspection request.

## What not to claim
- Do not call the demo technician verified.
- Do not say the inspection was performed by hardware diagnostics.
- Do not claim the QR record is tamper-proof or publicly hosted yet.
- Do not claim a Pollar payment has been processed.
- Do not describe a seller-entered record as an independent inspection.

## Judging narrative
DevicePassport aims to make device condition information portable across resale transactions. The defensible product is not another IMEI lookup: it is a structured, attributable, independent inspection record that can travel with the device. Pollar is intended to support the inspection transaction and wallet-linked identity/payment flow, while the inspection evidence and technician attestation remain separate claims that the platform must verify.
