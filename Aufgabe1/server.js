const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || 'server1';
// Parse peers from Env var (e.g., "http://server2:3000,http://server3:3000")
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

let counter = 0;

// --- CHANGED: Simulate High CPU Load instead of Latency ---
// This blocks the event loop to simulate heavy work 
function burnCpu() {
    const start = Date.now();
    // Run a loop for 500ms to simulate CPU work
    while (Date.now() - start < 500) {
        Math.random() * Math.random(); 
    }
}

// Synchronize with other servers
async function replicateToPeers(value) {
  // Fire and forget - don't wait for them, or it becomes too slow
  PEERS.forEach(peer => {
    axios.post(`${peer}/sync`, { counter: value })
         .catch(err => console.log(`[${SERVER_ID}] Sync failed to ${peer}`));
  });
}

// Optional: Try to get latest count on startup
async function initializeCounts() {
  let maxCounter = counter;
  for (const peer of PEERS) {
    try {
      const { data } = await axios.get(`${peer}/counter`, { timeout: 1000 });
      if (typeof data.counter === 'number' && data.counter > maxCounter) {
        maxCounter = data.counter;
      }
    } catch (err) {
      // It's normal for peers to be offline during startup
    }
  }
  counter = maxCounter;
  console.log(`[${SERVER_ID}] Initialized counter to ${counter}`);
}

// The heavy endpoint
app.post('/increment', async (req, res) => {
  burnCpu(); // Cause CPU load
  counter++;
  console.log(`[${SERVER_ID}] Counter incremented to ${counter}`);
  
  replicateToPeers(counter);
  
  res.json({ counter, server: SERVER_ID });
});

// Also handling GET for easy browser testing
app.get('/increment', async (req, res) => {
    burnCpu();
    counter++;
    console.log(`[${SERVER_ID}] Counter incremented to ${counter}`);
    replicateToPeers(counter);
    res.json({ counter, server: SERVER_ID });
});

// The sync endpoint (lightweight)
app.post('/sync', (req, res) => {
  if (typeof req.body.counter === 'number' && req.body.counter > counter) {
    counter = req.body.counter;
    console.log(`[${SERVER_ID}] Synced to ${counter}`);
  }
  res.json({ status: 'synced', counter });
});

app.get('/counter', (req, res) => {
  res.json({ counter, server: SERVER_ID });
});

app.listen(PORT, async () => {
  console.log(`[${SERVER_ID}] Running on port ${PORT}`);
  // Short delay to let other containers start before asking for data
  setTimeout(initializeCounts, 3000);
});