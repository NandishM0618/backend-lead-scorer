import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Lead Scorer Backend is running");
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})