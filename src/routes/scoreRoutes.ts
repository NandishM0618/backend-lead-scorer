import { Router } from "express";
import { state } from "../state.js";
import scoreByRules from "../services/ruleScorer.js";
import aiScoreLead from "../services/aiService.js";

const router = Router();

router.post("/", async (req, res) => {
    if (!state.currentOffer || state.leads.length === 0) {
        return res.status(400).json({ error: "Offer or leads missing" });
    }
    const results: any[] = [];
    for (const lead of state.leads) {
        const { ruleScore, ruleReasons } = scoreByRules(lead, state.currentOffer);
        const { aiPoints, aiIntent, aiExplanation } = await aiScoreLead(lead, state.currentOffer)

        const finalScore = ruleScore + aiPoints
        let intentLabel = "Low";
        if (finalScore >= 75) intentLabel = "High";
        else if (finalScore >= 40) intentLabel = "Medium"

        results.push({
            ...lead,
            score: finalScore,
            intent: intentLabel,
            reasoning: `${aiExplanation}`
        })
    }
    state.scoredLeads = results

    res.json({ message: "Scoring completed", count: results.length, scoredLead: results })
})

export default router