import { Router } from "express";
import { state } from "../state.js";

const router = Router();

router.post("/", (req, res) => {
    const { name, value_props, ideal_use_cases } = req.body;

    if (!name || !value_props || !ideal_use_cases) {
        return res.status(400).json({ error: "Missing fields" });
    }

    state.currentOffer = { name, value_props, ideal_use_cases }
    return res.json({ message: "Offer saved", offer: state.currentOffer })
})

export default router