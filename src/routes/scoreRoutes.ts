import { Router } from "express";
import { state } from "../state.js"; // shared in-memory state to store leads
import scoreByRules from "../services/ruleScorer.js"; // Rule-based scoring function
import aiScoreLead from "../services/aiService.js"; // AI-based scoring function

const router = Router();

//  POST Route — Score all uploaded leads using both rules + AI
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
            ...lead, // original lead data
            score: finalScore, // combined final score
            intent: intentLabel, // High/Medium/Low intent Label
            reasoning: `${aiExplanation}` // Explanation from AI
        })
    }
    // Save scored leads back to global state
    state.scoredLeads = results

    // Send response with total scored leads
    res.json({ message: "Scoring completed", count: results.length, scoredLead: results })
})

export default router