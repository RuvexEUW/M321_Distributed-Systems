// Datei: backend/src/app.js
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const app = express();

// CORS erlauben für dein Frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// API-Routen
app.use("/api", apiRoutes);

// Port 3001 (du hast gesagt, dort läuft es)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
