const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || 'server1';
const PEERS = process.env.PEERS?.split(',').filter(Boolean) || [];

let counter = 0;

// Simuliere zufällige Latenz
function simulateLatency() {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 200));
}

// Synchronisiere Counter mit anderen Servern
async function replicateToPeers(value) {
  for (const peer of PEERS) {
    try {
      await axios.post(`${peer}/sync`, { counter: value });
    } catch (err) {
      console.log(`[${SERVER_ID}] Failed to sync with ${peer}: ${err.message}`);
    }
  }
}

// Initialisiere Counter beim Start, damit Server nach Restart auf den höchsten Wert kommt
async function initializeCounts() {
  let maxCounter = counter;
  for (const peer of PEERS) {
    try {
      const { data } = await axios.get(`${peer}/counter`);
      if (typeof data.counter === 'number' && data.counter > maxCounter) {
        maxCounter = data.counter;
      }
    } catch (err) {
      console.log(`[${SERVER_ID}] Could not fetch counter from ${peer}`);
    }
  }
  counter = maxCounter;
  console.log(`[${SERVER_ID}] Initialized counter to ${counter}`);
}

app.get('/increment', async (req, res) => {
  await incrementCounter(req, res);
});

app.post('/increment', async (req, res) => {
  await incrementCounter(req, res);
});

async function incrementCounter(req, res) {
  await simulateLatency();
  counter++;
  console.log(`[${SERVER_ID}] Counter incremented to ${counter}`);
  await replicateToPeers(counter);
  res.json({ counter, server: SERVER_ID });
}

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

// Server starten
app.listen(PORT, async () => {
  await initializeCounts();
  console.log(`[${SERVER_ID}] Running on port ${PORT}`);
});
