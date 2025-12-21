// server.js

const express = require("express");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const cors = require("cors");

const connectDB = require("./src/config/db");
const userRouter = require("./src/routes/userRouter");

const app = express();

// DB
connectDB();

// CORS options (validated)
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5173"];

        // allow Postman / server-side requests
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/v1/users", userRouter);

// Server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
