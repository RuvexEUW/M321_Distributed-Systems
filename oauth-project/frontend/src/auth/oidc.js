
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const oidcConfig = {
  authority: 'http://localhost:8080/realms/m321',
  client_id: 'oauth-frontend',
  redirect_uri: 'http://localhost:5173/callback.html',
  post_logout_redirect_uri: 'http://localhost:5173/',
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage })
};

const userManager = new UserManager(oidcConfig);

export function login() {
  return userManager.signinRedirect();
}

export async function handleCallback() {
  const user = await userManager.signinRedirectCallback();
  return user;
}

export async function getAccessToken() {
  const user = await userManager.getUser();
  return user?.access_token || null;
}

export function logout() {
  return userManager.signoutRedirect();
}
