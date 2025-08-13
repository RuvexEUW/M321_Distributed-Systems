const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const SELF_URL = `http://localhost:${PORT}`;
const PEERS = (process.env.PEERS || '').split(',').filter(p => p);

let counter = 0;

function simulateLatency() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 200));
}

async function replicateCounter(newValue) {
    const promises = PEERS.map(async peer => {
        try {
            await axios.post('${peer}/replicate', { counter: newValue});
        } catch (err) {
            console.log('[Replicate] Fehler bei ${peer}: ${err.message}');
        }
    });
    await Promise.all(promises)
}

app.get('/increment', async (req, res) => {
    await simulateLatency();
    counter++;
    await replicateCounter(counter);
    res.json({ counter });
});

app.get('/counter', (req, res) => {
    res.json({ counter });
});

app.listen(currentPort, async () => {
    console.log(`Server running on port ${currentPort}`)
});