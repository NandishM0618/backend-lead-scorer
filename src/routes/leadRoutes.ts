import { parse } from "csv-parse";
import { Router } from "express";
import fs from 'fs'
import multer from "multer";
import { state } from "../state.js"; // shared in-memory state to store leads

const router = Router();
const upload = multer({ dest: "uploads/" }) // temp folder for CSV upload

// POST route to upload leads CSV
router.post("/", upload.single("leads_csv"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const results: any[] = []

    // Read and parse the uploaded CSV
    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on("data", (row) => {
            results.push(row); // push each parsed CSV row into results array
        }).on("end", () => {
            state.leads = results;
            fs.unlinkSync(req.file!.path);

            // Send response with how many leads were uploaded
            res.json({ message: "Leads uploaded", count: state.leads.length })
        }).on("error", (err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to parse CSV" })
        })
})

export default router