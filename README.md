# GenResolve 🤝⚖️

> AI-powered decentralized dispute resolution protocol built on [GenLayer](https://genlayer.com)
> Hackathon: [GenLayer Bradbury — DoraHacks](https://dorahacks.io/hackathon/genlayer-bradbury/detail)

## Overview

GenResolve leverages GenLayer's Intelligent Contracts and Optimistic Democracy consensus to resolve real-world disputes using LLMs as impartial arbiters — trustlessly and on-chain.

## Use Cases

| Method | Description | Options |
|--------|-------------|---------|
| `resolve_freelance_dispute` | Freelancer vs Client | `PAY_FREELANCER` / `REFUND_CLIENT` |
| `resolve_prediction_market` | Verify factual outcomes | `YES` / `NO` |
| `evaluate_dao_grant` | DAO grant progress check | `APPROVED` / `REJECTED` |
| `moderate_content` | Community safety moderation | `SAFE` / `FLAGGED` |

## Project Structure

```
genresolve/
├── contracts/
│   └── gen_resolve.py    # GenLayer Intelligent Contract
└── README.md
```

## Deployment

Deploy menggunakan **official GenLayer CLI** (satu-satunya metode yang didukung):

```bash
# Step 1: Install GenLayer CLI
npm install -g genlayer

# Step 2: Deploy ke testnet Bradbury
genlayer deploy contracts/gen_resolve.py
```

> 💡 Alternatif tanpa CLI: Upload langsung via [GenLayer Studio](https://studio.genlayer.com)

## Tech Stack

- **Runtime**: GenLayer GenVM (`py-genlayer:latest`)
- **Language**: Python
- **LLM Calls**: `gl.exec_prompt()`
- **Consensus**: `gl.eq_principle_strict_eq()` (Optimistic Democracy)
- **Deploy**: `genlayer` CLI (npm)
