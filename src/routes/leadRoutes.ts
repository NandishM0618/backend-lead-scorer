import { parse } from "csv-parse";
import { Router } from "express";
import fs from 'fs'
import multer from "multer";
import { state } from "../state.js";

const router = Router();
const upload = multer({ dest: "uploads/" })

router.post("/", upload.single("leads_csv"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const results: any[] = []

    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on("data", (row) => {
            results.push(row);
        }).on("end", () => {
            state.leads = results;
            fs.unlinkSync(req.file!.path);
            res.json({ message: "Leads uploaded", count: state.leads.length })
        }).on("error", (err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to parse CSV" })
        })
})

export default router