import express, { type NextFunction, type Request, type Response } from "express";
import dotenv from "dotenv";

// Import feature routes
import offerRouter from "./routes/offerRoutes.js"
import leadRouter from './routes/leadRoutes.js'
import scoreRouter from './routes/scoreRoutes.js'
import resultRouter from './routes/resultRoutes.js'

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json()) // Parse incoming JSON requests

const PORT = process.env.PORT || 4000;

/* ---------------------- Health Check Route ---------------------- */
app.get("/", (req, res) => {
    res.send("Lead Scorer Backend is running");
})

/* ---------------------- API Routes ---------------------- */
// Route for creating and managing offers
app.use("/offer", offerRouter);

// Route for uploading leads CSV
app.use("/leads/upload", leadRouter);

// Route for scoring leads using AI + rules
app.use("/score", scoreRouter);

// Route to get results after scoring
app.use("/results", resultRouter);

//* ---------------------- 404 Error Handler ---------------------- */
// Handles requests to undefined routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

/* ---------------------- Centralized Error Handler ---------------------- */
//  Catch-all error handler for any unhandled errors in routes
app.use(
    (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error("Unexpected error:", err.message || err);

        // If error has status code, use it; otherwise default to 500
        const status = err.status || 500;
        const message =
            err.message || "Something went wrong on the server. Please try again.";

        res.status(status).json({
            success: false,
            error: message,
        });
    }
);


/* ---------------------- Start Server ---------------------- */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})