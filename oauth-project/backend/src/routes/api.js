import express from "express";
import { expressjwt as jwt } from "express-jwt";
import jwks from "jwks-rsa";

const router = express.Router();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      "http://localhost:8080/realms/security-lab/protocol/openid-connect/certs",
  }),
  issuer: "http://localhost:8080/realms/security-lab",
  algorithms: ["RS256"],
  // audience: "oauth-frontend", // nur wenn du audience prüfst
});

router.get("/data", jwtCheck, (req, res) => {
  res.json({
    message: "Token gültig! Geschützte Daten 🛡️",
    user: req.auth,
  });
});

export default router;
