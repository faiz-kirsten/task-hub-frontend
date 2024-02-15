import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jobsRoute from "./routes/jobsRoute.js";

const app = express();

// middleware for handling cors policy instead of adding proxy in react app
app.use(cors());

app.use(bodyParser.json()); // allows us to take in incoming post request bodies

app.use("/jobs", jobsRoute);

app.get("/", (req, res) => {
    res.send("This is the homepage!");
});

// establish a connection to the database
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("Server connected to database");
        app.listen(PORT, () => {
            console.log(`Server listening on port: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
