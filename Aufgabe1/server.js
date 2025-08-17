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

app.post('/replicate', async (req, res) => {
    const newValue = req.body.counter;
    if (typeof newValue === 'number' && newValue > counter) {
        counter = newValue;
    }
    res.json({ counter });
});

app.get('/counter', (req, res) => {
    res.json({ counter });
});

app.post('/sync', async (req, res) => {
    const peerCounters = req.body.counters || [];
    const maxCounter = Math.max(counter, ...peerCounters);
    counter = maxCounter;
    res.json({ counter });
});

async function startupSync() {
    if (PEERS.length === 0) return;
    try {
        const responses = await Promise.all(PEERS.map(peer => axios.get(`${peer}/counter`).catch(() => ({ data: { counter: 0 } }))));
        const peerCounters = responses.map(r => r.data.counter || 0);
        const maxCounter = Math.max(counter, ...peerCounters);
        counter = maxCounter;
        console.log(`[StartupSync] Counter auf ${counter} gesetzt`);
    } catch (err) {
        console.log(`[StartupSync] Fehler: ${err.message}`);
    }
}

app.listen(PORT, async () => {
    console.log(`Server läuft auf Port ${PORT}`);
    await startupSync();
});