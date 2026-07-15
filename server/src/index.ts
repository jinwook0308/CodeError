import cors from "cors";
import express from "express";
import { afterDemoPage, beforeDemoPage } from "./data/demoPages.js";
import { scanRouter } from "./routes/scan.js";

const app = express();
const port = 3001;

app.disable("x-powered-by");
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.get("/demo/before", (_request, response) => response.type("html").send(beforeDemoPage));
app.get("/demo/after", (_request, response) => response.type("html").send(afterDemoPage));
app.use("/api/scan", scanRouter);

app.listen(port, () => {
  console.log(`CodeError API listening on http://localhost:${port}`);
});
