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

1. Open [GenLayer Studio](https://studio.genlayer.com)
2. Upload `contracts/gen_resolve.py`
3. Deploy to the GenLayer testnet
4. Interact via the Studio UI or CLI

## Tech Stack

- **Runtime**: GenLayer GenVM (`py-genlayer:latest`)
- **Language**: Python
- **LLM Calls**: `gl.exec_prompt()`
- **Consensus**: `gl.eq_principle_strict_eq()` (Optimistic Democracy)
