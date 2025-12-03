// Datei: oauth-project/frontend/src/main.js

import { login, logout, getAccessToken } from './auth/oidc.js';

function setResult(text) {
  const el = document.getElementById('result');
  if (!el) return;
  el.textContent =
    typeof text === 'string' ? text : JSON.stringify(text, null, 2);
}

window.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const btnGetData = document.getElementById('btn-get-data');

  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      login().catch(err => {
        console.error('Login error', err);
        setResult('Login error: ' + err);
      });
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logout().catch(err => {
        console.error('Logout error', err);
        setResult('Logout error: ' + err);
      });
    });
  }

  if (btnGetData) {
    btnGetData.addEventListener('click', async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setResult('Kein Token vorhanden – bist du eingeloggt?');
          return;
        }

        const response = await fetch('http://localhost:3001/api/data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setResult('Backend-Fehler: ' + response.status);
          return;
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error('Fehler beim /data-Request', err);
        setResult('Fehler beim /data-Request: ' + err);
      }
    });
  }
});
