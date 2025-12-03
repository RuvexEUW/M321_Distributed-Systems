import { Router } from "express";

const express = require('express');
const router = express.Router();

const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');


const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'http://localhost:8080/realms/m321/protocol/openid-connect/certs'
  }),
  issuer: 'http://localhost:8080/realms/m321',
  algorithms: ['RS256']
});



router.get('/data', authMiddleware, function (req, res, next) {
  res.json({
    message: "Geschützte Daten aus dem Backend",
    timestamp: new Date().toISOString(),
    user: req.user
  });
});

module.exports = router;