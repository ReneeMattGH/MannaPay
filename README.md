#  MannaPay    💳 → 🔗 → 🎬  #
   
### MannaPay makes subscriptions simple — pay only for what you use, stop anytime. ###
A Bitcoin-powered subscription hub built on Layer-2, designed to give users full control over their streaming and digital subscriptions.



---


### Features ###

- Wallet Connect (demo) — start with one click, no complex onboarding.
- Choose Streaming Services — connect to platforms like Netflix, Prime, Spotify.
- Flexible Payments — pay monthly or stop anytime, no lock-ins.
- Instant Refund Simulation — shows how unused time converts back instantly.
- No more loosing money on forgetting to cancel.

---

## Blockchain Layer ##

- Stacks Layer-2 (Bitcoin-secured) → all subscription logic runs on Stacks chain, anchored to Bitcoin for security.
- Clarity Smart Contracts →
     - Lock subscription funds.
     - Stream monthly payments.
     - Enable instant refunds when user cancels.
     - Transparent, auditable by anyone.
- Stacks API (Hiro API / Stacks Blockchain API) → fetch live transaction states, balances, and contract events.
- Leather Wallet SDK → secure wallet connection and contract calls.

---

## Frontend (User-Facing dApp) ##

- React + TypeScript → scalable and hackathon-friendly frontend.
- Tailwind CSS + shadcn/ui + Framer Motion → sleek, slim, and aesthetic UI.
- Stacks.js SDK → direct interaction between frontend and Clarity contracts.

---

### Backend (Lightweight Support Layer) ##

Node.js + Express → handles app logic outside blockchain, like storing subscription preferences.
Simple Database → keeps track of:
   - Which user subscribed to which service.
   - Plan details (Basic / Premium).
   - Timestamps for start/stop.

MannaPay keeps the critical money logic on-chain with Clarity contracts, but use a lightweight backend only to store simple subscription data and send real-time updates to the user dashboard.

---

# Getting the rep #

### 1. Clone the Repo: ### 
```bash
git clone https://github.com/" "/mannapay.git
cd mannapay
```

### 2. Installing the Dependencies: ###
```bash
npm install
```

### 3. Starting the repo: ###
```bash
npm run 
npm start
```

⚡ MannaPay — making subscriptions smarter with Bitcoin.
