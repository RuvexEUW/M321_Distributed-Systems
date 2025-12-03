import { Router } from "express";

const router = Router();

router.get("/data", (req, res) => {
  res.json({
    message: "Geschützte Daten aus dem Backend",
    timestamp: new Date().toISOString()
  });
});

export default router;