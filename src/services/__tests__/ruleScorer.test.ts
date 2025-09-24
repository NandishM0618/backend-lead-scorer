import { describe, it } from "node:test";
import assert from "assert";
import scoreByRules from "../ruleScorer.js";

describe('Rule Layer Scoring', () => {
    it("assings 20 points for decision maker role", () => {
        const lead = {
            name: 'Ava Health',
            role: "Head of Growth",
            company: "FlowMetrix",
            industry: "B2B SaaS",
            location: "USA",
            linkedin_bio: "Experienced growth leader in SaaS"
        };
        const offer = {
            ideal_use_cases: [
                "B2B SaaS mid-market"
            ]
        }
        const { ruleScore } = scoreByRules(lead, offer);
        assert.ok(ruleScore >= 20, "Score should be 20 or greater for Head of Growth")
    })

    it("assigns 10 points for incomplete data", () => {
        const lead = {
            name: "James",
            role: "Marketing Manager",
            company: "",
            industry: "",
            location: "",
            linkedin_bio: ""
        };
        const offer = {
            name: "Develop future technologies",
            value_props: ["24/7 outreach", "meetings"],
            ideal_use_cases: ["Fintech"]
        };
        const { ruleScore } = scoreByRules(lead, offer);
        assert.ok(ruleScore <= 20, "Score should be 20 or less for manager role/incomplete data")
    })

    it("gives 20 points if industry matches ideal use case", () => {
        const lead = {
            name: "John Doe",
            role: "Engineer",
            company: "TechCorp",
            industry: "Fintech AI Solutions",
            location: "UK",
            linkedin_bio: "Engineer working on fintech AI",
        };
        const offer = { ideal_use_cases: ["Fintech", "SaaS"] };
        const { ruleScore } = scoreByRules(lead, offer);
        assert.ok(ruleScore >= 20, "Score should add 20 if industry matches ICP");
    });

    it("does not add industry points if no match", () => {
        const lead = {
            name: "Alice",
            role: "VP Marketing",
            company: "MediaCorp",
            industry: "Media & Entertainment",
            location: "USA",
            linkedin_bio: "Marketing VP with 10+ years experience",
        };
        const offer = { ideal_use_cases: ["Fintech", "Healthcare"] };
        const { ruleScore } = scoreByRules(lead, offer);
        assert.ok(ruleScore < 40, "Score should not have industry bonus if no match");
    });

    it("adds completeness points when all fields present", () => {
        const lead = {
            name: "Sophia",
            role: "Director of Technology",
            company: "HealthTech",
            industry: "Healthcare AI",
            location: "USA",
            linkedin_bio: "Tech director building AI health tools",
        };
        const offer = { ideal_use_cases: ["Healthcare AI"] };
        const { ruleScore } = scoreByRules(lead, offer);
        assert.ok(ruleScore % 10 === 0, "Score should include completeness bonus");
    });

    it("decision maker + industry match + complete data gives high score", () => {
        const lead = {
            name: "Ethan",
            role: "CEO",
            company: "FinTechPro",
            industry: "Fintech SaaS",
            location: "Germany",
            linkedin_bio: "CEO scaling fintech SaaS product",
        };
        const offer = { ideal_use_cases: ["Fintech SaaS"] };
        const { ruleScore } = scoreByRules(lead, offer);
        assert.ok(
            ruleScore >= 50,
            "Score should be high when decision maker + ICP match + complete fields"
        );
    });

})