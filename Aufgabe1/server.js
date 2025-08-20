const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || 'server1';
const OTHER_SERVERS = process.env.OTHER_BACKENDS?.split(',').filter(Boolean) || [];

let counter = 0;

function simulateLatency() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 200));
}

async function replicateToPeers(value) {
  for (const server of OTHER_SERVERS) {
    try {
      await axios.post(`${server}/sync`, { counter: value });
    } catch (err) {
      console.log(`[${SERVER_ID}] Failed to sync with ${server}: ${err.message}`);
    }
  }
}

async function initializeCounts() {
  let maxCounter = counter;
  for (const server of OTHER_SERVERS) {
    try {
      const { data } = await axios.get(`${server}/counter`);
      if (typeof data.counter === 'number' && data.counter > maxCounter) {
        maxCounter = data.counter;
      }
    } catch (err) {
      console.log(`[${SERVER_ID}] Could not fetch counter from ${server}`);
    }
  }
  counter = maxCounter;
  console.log(`[${SERVER_ID}] Initialized counter to ${counter}`);
}

app.post('/increment', async (req, res) => {
  await simulateLatency();
  counter++;
  console.log(`[${SERVER_ID}] Counter incremented to ${counter}`);
  await replicateToPeers(counter);
  res.json({ counter, server: SERVER_ID });
});

app.post('/sync', async (req, res) => {
  await simulateLatency();
  if (typeof req.body.counter === 'number' && req.body.counter > counter) {
    counter = req.body.counter;
    console.log(`[${SERVER_ID}] Counter synchronized to ${counter}`);
  }
  res.json({ counter });
});

app.get('/counter', (req, res) => {
  res.json({ counter, server: SERVER_ID });
});

app.get('/protected', validateToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
  });
});

// -------------------- Startup --------------------
app.listen(PORT, async () => {
  await initializeCounts();
  console.log(`[${SERVER_ID}] Running on port ${PORT}`);
});

app.listen(PORT, async () => {
    console.log(`Server läuft auf Port ${PORT}`);
    await startupSync();
});