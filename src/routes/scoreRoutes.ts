import { Router } from "express";
import { state } from "../state.js";
import scoreByRules from "../services/ruleScorer.js";

const router = Router();

router.post("/", async (req, res) => {
    if (!state.currentOffer || state.leads.length === 0) {
        return res.status(400).json({ error: "Offer or leads missing" });
    }
    const results: any[] = [];
    for (const lead of state.leads) {
        const { ruleScore, ruleReasons } = scoreByRules(lead, state.currentOffer);

        let intentLabel = "Low";
        if (ruleScore >= 75) intentLabel = "High";
        else if (ruleScore >= 40) intentLabel = "Medium"

        results.push({
            ...lead,
            score: ruleScore,
            intent: intentLabel,
            reasoning: ruleReasons
        })
    }
    state.scoredLeads = results
    res.json({ message: "Scoring completed", count: results.length, scoredLead: results })
})

export default router