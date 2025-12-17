const axios = require('axios');

// We only hit the Load Balancer (NGINX)
const TARGET = 'http://localhost/increment';

const REQUESTS_PER_SECOND = 5; // Reduced slightly so we don't crash the simulation immediately
const DURATION_SECONDS = 20;

async function spamIncrements() {
  console.log(`Spamming ${TARGET} ...`);
  const endTime = Date.now() + DURATION_SECONDS * 1000;

  while (Date.now() < endTime) {
      axios.get(TARGET)
        .then(res => {
          // Verify that different servers answer
          console.log(`Response from ${res.data.server} | Counter: ${res.data.counter}`);
        })
        .catch(err => {
          console.error(`Error:`, err.message);
        });
    
    // Simple delay
    await new Promise(r => setTimeout(r, 1000 / REQUESTS_PER_SECOND));
  }
  console.log("Done spamming.");
}

spamIncrements();