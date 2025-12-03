import axios from "axios";


export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Kein Authorization Header vorhanden" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Kein Token im Authorization Header" });
  }

  next();
}
