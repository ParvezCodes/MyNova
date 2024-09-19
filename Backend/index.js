import { config } from "dotenv";
config({
  path: "./DB/.env",
});

import express from "express";
import cors from "cors";
import IsinRouter from "./routes/ISIN.js";
import SearchRouter from "./routes/Search.js";
import NovaProdRouter from "./routes/NovaProd.js";
import singleStatusRouter from "./routes/singleStatus.js";
import TSRouter from "./routes/TS.js";
import TSUpdateCM from "./routes/Update_TP_CM.js";
import MerlinToNovaRoute from "./routes/MerlinToNova.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/isin", IsinRouter);
app.use("/api/v1/search", SearchRouter);
app.use("/api/v1/compare", NovaProdRouter);
app.use("/api/v1/statusSingle", singleStatusRouter);
app.use("/api/v1/ts", TSRouter);
app.use("/api/v1/tsupdate", TSUpdateCM);
app.use("/api/v1/merlintonova", MerlinToNovaRoute);

export default app;
