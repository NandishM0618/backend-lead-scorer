import express from "express";
import dotenv from "dotenv";
import offerRouter from "./routes/offerRoutes.js"

dotenv.config();

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 4000;

// health test route
app.get("/", (req, res) => {
    res.send("Lead Scorer Backend is running");
})

app.use("/offer", offerRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})