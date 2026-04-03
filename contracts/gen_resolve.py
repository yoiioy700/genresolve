from genlayer import *
import json


class GenResolve(gl.Contract):
    """
    GenResolve: A decentralized, AI-powered dispute resolution protocol built on GenLayer.
    It leverages Intelligent Contracts to resolve disputes in a trust-minimized way
    by using LLMs as impartial arbiters under GenLayer's Optimistic Democracy consensus.
    """

    # --- State Variables ---
    owner: str
    dispute_count: bigint
    last_resolution: str

    def __init__(self):
        self.owner = gl.message.sender_address
        self.dispute_count = 0
        self.last_resolution = ""

    # =========================================================================
    # 1. Freelance Dispute Resolution
    # =========================================================================
    @gl.public.write
    def resolve_freelance_dispute(self, initial_agreement: str, submitted_work: str) -> str:
        """
        Resolves a dispute between a freelancer and a client.
        Compares the original agreement against the submitted work to determine
        if the deliverable meets the agreed-upon requirements.
        Options: PAY_FREELANCER | REFUND_CLIENT
        """
        prompt = f"""You are an impartial arbitration AI for freelance work disputes.
Your job is to analyze the original agreement and the submitted work, then deliver a verdict.

--- ORIGINAL AGREEMENT ---
{initial_agreement}

--- SUBMITTED WORK ---
{submitted_work}

Based solely on the above, determine if the submitted work sufficiently fulfills
the terms of the original agreement.

Rules:
- If the work meets or reasonably approximates the agreement's core requirements, return "PAY_FREELANCER".
- If the work is substantially incomplete, off-target, or fails to meet key deliverables, return "REFUND_CLIENT".
- Respond ONLY with one of these two options, nothing else: PAY_FREELANCER or REFUND_CLIENT
"""
        def get_verdict() -> str:
            result = gl.exec_prompt(prompt).strip().upper()
            if result not in ["PAY_FREELANCER", "REFUND_CLIENT"]:
                return "REFUND_CLIENT"
            return result

        verdict = gl.eq_principle_strict_eq(get_verdict)
        self.last_resolution = verdict
        self.dispute_count += 1
        return verdict

    # =========================================================================
    # 2. Prediction Market Resolution
    # =========================================================================
    @gl.public.write
    def resolve_prediction_market(self, market_question: str) -> str:
        """
        Resolves a yes/no prediction market question based on verifiable facts.
        The LLM acts as a fact-checker using its current knowledge.
        Options: YES | NO
        """
        prompt = f"""You are a neutral fact-verification AI for a prediction market.
Your task is to determine the factual outcome for the following question.

--- MARKET QUESTION ---
{market_question}

Rules:
- Research the statement carefully based on factual, verifiable information.
- If the statement is TRUE or the event DID HAPPEN, respond with "YES".
- If the statement is FALSE or the event DID NOT HAPPEN, respond with "NO".
- Respond ONLY with one of these two options, nothing else: YES or NO
"""
        def get_verdict() -> str:
            result = gl.exec_prompt(prompt).strip().upper()
            if result not in ["YES", "NO"]:
                return "NO"
            return result

        verdict = gl.eq_principle_strict_eq(get_verdict)
        self.last_resolution = verdict
        self.dispute_count += 1
        return verdict

    # =========================================================================
    # 3. DAO Grant Evaluation
    # =========================================================================
    @gl.public.write
    def evaluate_dao_grant(self, dao_manifesto: str, progress_report: str) -> str:
        """
        Evaluates whether a DAO grant recipient should receive continued funding.
        Assesses the progress report against the goals stated in the DAO manifesto.
        Options: APPROVED | REJECTED
        """
        prompt = f"""You are an independent evaluator for a Decentralized Autonomous Organization (DAO) grant program.
Your task is to assess whether a grant recipient has made sufficient progress to justify continued funding.

--- DAO MANIFESTO / GRANT GOALS ---
{dao_manifesto}

--- GRANTEE PROGRESS REPORT ---
{progress_report}

Rules:
- Evaluate how well the grantee's progress aligns with the stated goals in the manifesto.
- Consider milestones achieved, effort demonstrated, and impact of the work.
- If progress is satisfactory and the project is on track, respond with "APPROVED".
- If progress is insufficient, off-mission, or the report is vague and unsubstantiated, respond with "REJECTED".
- Respond ONLY with one of these two options, nothing else: APPROVED or REJECTED
"""
        def get_verdict() -> str:
            result = gl.exec_prompt(prompt).strip().upper()
            if result not in ["APPROVED", "REJECTED"]:
                return "REJECTED"
            return result

        verdict = gl.eq_principle_strict_eq(get_verdict)
        self.last_resolution = verdict
        self.dispute_count += 1
        return verdict

    # =========================================================================
    # 4. Community Content Moderation
    # =========================================================================
    @gl.public.write
    def moderate_content(self, post_content: str) -> str:
        """
        Moderates a piece of community-submitted content against safety standards.
        Determines whether the content is safe for community consumption.
        Options: SAFE | FLAGGED
        """
        prompt = f"""You are a community safety AI moderator for a decentralized platform.
Your task is to evaluate a piece of user-submitted content against community safety standards.

--- POST CONTENT ---
{post_content}

Community Safety Standards — Content should be flagged if it contains:
  - Hate speech or discrimination based on race, gender, religion, nationality, etc.
  - Explicit threats of violence or harassment toward individuals or groups.
  - Illegal activity promotion (fraud, scams, drug trafficking, etc.).
  - Non-consensual sexual or NSFW content.
  - Clear and deliberate misinformation designed to cause harm.

Rules:
- If the content violates one or more of the above standards, respond with "FLAGGED".
- If the content is acceptable and does not violate community standards, respond with "SAFE".
- Respond ONLY with one of these two options, nothing else: SAFE or FLAGGED
"""
        def get_verdict() -> str:
            result = gl.exec_prompt(prompt).strip().upper()
            if result not in ["SAFE", "FLAGGED"]:
                return "FLAGGED"
            return result

        verdict = gl.eq_principle_strict_eq(get_verdict)
        self.last_resolution = verdict
        self.dispute_count += 1
        return verdict

    # =========================================================================
    # View Functions (Read-Only)
    # =========================================================================
    @gl.public.view
    def get_dispute_count(self) -> bigint:
        """Returns the total number of disputes resolved by this contract instance."""
        return self.dispute_count

    @gl.public.view
    def get_last_resolution(self) -> str:
        """Returns the verdict of the most recent resolution."""
        return self.last_resolution

    @gl.public.view
    def get_owner(self) -> str:
        """Returns the address of the contract deployer."""
        return self.owner
