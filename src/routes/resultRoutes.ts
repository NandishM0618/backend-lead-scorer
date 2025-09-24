import { Router } from "express";
import { state } from "../state.js";
import { Parser } from 'json2csv'

const router = Router();

router.get("/", (req, res) => {
    if (!state.scoredLeads || state.scoredLeads.length === 0) {
        return res.status(400).json({ error: "No scored leads found. Run /score first." })
    }
    res.json(state.scoredLeads)
})

router.get("/csv", (req, res) => {
    if (!state.scoredLeads || state.scoredLeads.length === 0) {
        return res.status(400).json({ error: "No scored leads found. Run /score first." })
    }
    const fields = ["name", "role", "company", "industry", "intent", "score", "reasoning"];
    const parser = new Parser({ fields })
    const csv = parser.parse(state.scoredLeads);
    res.header("content-type", "text/csv");
    res.attachment("scored_leads.csv");
    res.send(csv)
})

export default router