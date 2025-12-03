// Datei: frontend/src/auth/oidc.js

import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const oidcConfig = {
  // dein Realm "security-lab"
  authority: "http://localhost:8080/realms/security-lab",

  client_id: "oauth-frontend", // wie in Keycloak-Client
  redirect_uri: "http://localhost:5173/callback.html",
  post_logout_redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "openid profile email",

  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const userManager = new UserManager(oidcConfig);

export function login() {
  console.log("Starte Login mit Config:", oidcConfig);
  return userManager.signinRedirect();
}

export async function handleCallback() {
  const user = await userManager.signinRedirectCallback();
  console.log("User nach Callback:", user);
  return user;
}

export async function getAccessToken() {
  const user = await userManager.getUser();
  console.log("getAccessToken user =", user);
  return user?.access_token || null;
}

export function logout() {
  return userManager.signoutRedirect();
}
