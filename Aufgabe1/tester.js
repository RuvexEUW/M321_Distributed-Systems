const axios = require('axios');

const TARGETS = [
  'http://localhost:3001/increment',
  'http://localhost:3002/increment',
  'http://localhost:3003/increment'
];

const REQUESTS_PER_SECOND = 20;
const DURATION_SECONDS = 100;

async function spamIncrements() {
  console.log(`Spamming ${REQUESTS_PER_SECOND} req/s for ${DURATION_SECONDS}s…`);
  const endTime = Date.now() + DURATION_SECONDS * 1000;

  while (Date.now() < endTime) {
    for (const target of TARGETS) {
      axios.get(target)
        .then(res => {
          console.log(`${target} counter=${res.data.counter}`);
        })
        .catch(err => {
          console.error(`Error calling ${target}:`, err.message);
        });
    }
    await new Promise(r => setTimeout(r, 1000 / REQUESTS_PER_SECOND));
  }
  console.log("Done spamming.");
}

spamIncrements();