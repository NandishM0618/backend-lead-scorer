const decisionMakerKeywords = ["ceo", "founder", "co-founder", "head", "vp", "director", "chief"]
const influencerKeywords = ["manager", "lead", "principal", "senior"]

export default function scoreByRules(lead: any, offer: any) {
    let score = 0;
    const reasons: string[] = []

    const roleLower = lead.role.toLowerCase();
    if (decisionMakerKeywords.some(k => roleLower.includes(k))) {
        score += 20;
        reasons.push("Role is decision maker (+20)")
    }
    else if (influencerKeywords.some(k => roleLower.includes(k))) {
        score += 10;
        reasons.push("Role is influencer (+10)")
    }
    else {
        reasons.push("Role not relevant (+0)")
    }

    const industryLower = lead.industry.toLowerCase();
    const idealMatch = offer.ideal_use_cases.some((uc: string) => {
        industryLower.includes(uc.toLowerCase())
    });
    if (idealMatch) {
        score += 20;
        reasons.push("Industry matches ICP (+20)")
    }
    else {
        reasons.push("Industry does not match (+0)")
    }
    const requiredFields = ["name", "role", "company", "industry", "location", "linkedin_bio"];
    const complete = requiredFields.every(f => lead[f] && lead[f].trim() !== "");
    if (complete) {
        score += 10;
        reasons.push("All data fields present (+10)");
    } else {
        reasons.push("Missing some data fields (+0)");
    }
    return { ruleScore: score, ruleReasons: reasons }
}

