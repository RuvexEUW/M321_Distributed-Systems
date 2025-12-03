# Setup Keycloak

## 1. Realm erstellen

Name: security-lab

## 2. User anlegen

Username: testuser

Password: testpass

Email Verified: on

## 3. Client (unsicheres SPA) anlegen

Client ID: spa-unsafe

Client Type: Public

Redirect URIs: http://localhost:5173/*

Web Origins: * 

# Frontend und Backend einrichten

## Frontend


2.4 OIDC Discovery & JWKS-URL

Diese URLs brauchst du gleich für Frontend & Backend:

Issuer / Authority:
http://localhost:8080/realms/m321

OpenID-Configuration (Discovery):
http://localhost:8080/realms/m321/.well-known/openid-configuration 

JWKS (Public Keys): steht in der Discovery unter jwks_uri, meist:
http://localhost:8080/realms/m321/protocol/openid-connect/certs



Backend:
http://localhost:3000

