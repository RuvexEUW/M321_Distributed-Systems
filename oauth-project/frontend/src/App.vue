<script setup>
import { login, logout, getAccessToken } from './auth/oidc';
async function onLoginClick() {
  await login();
}

async function onLogoutClick() {
  await logout();
}
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <button onclick="onLoginClick()">Login mit Keycloak</button>
  <button onclick="onLogoutClick()">Logout</button>
</template>

<style scoped></style>
