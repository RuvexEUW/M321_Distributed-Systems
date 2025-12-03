import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

<<<<<<< HEAD
/**
 * Redis-Setup
 * - Verbindet bei Start
 * - Fallback: läuft ohne Cache, falls Redis nicht erreichbar
 * - TTL-Steuerung mit ZWEI Variablen
 */
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CACHE_TTL_POKEMON_SECONDS = Number(process.env.CACHE_TTL_POKEMON_SECONDS || 60 * 60); // 1h
const CACHE_TTL_LIST_SECONDS   = Number(process.env.CACHE_TTL_LIST_SECONDS   || 60 * 30);  // 30min (aktuell ungenutzt)

const redis = createClient({ url: REDIS_URL });
let cacheReady = false;

try {
  await redis.connect();
  cacheReady = true;
  console.log('✅ Redis verbunden:', REDIS_URL);
} catch (err) {
  console.warn('⚠️  Konnte nicht mit Redis verbinden. Läuft ohne Cache.', err?.message);
}

/**
 * GET /api/pokemon/:name
 * - Prüft zuerst den Cache
 * - MISS: holt von PokeAPI, speichert mit TTL
 */
=======

>>>>>>> cbade7a7af1ee9030feedbcb86e5cf5ca5da2fd8
app.get('/api/pokemon/:name', async (req, res) => {
  const name = req.params.name.toLowerCase();
  const cacheKey = `pokemon:${name}`;

  try {
    if (cacheReady) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const lean = {
      id: data.id,
      name: data.name,
      sprite: data.sprites?.front_default ?? null,
      height: data.height,
      weight: data.weight,
      types: data.types?.map(t => t.type.name) ?? [],
      stats: Object.fromEntries((data.stats ?? []).map(s => [s.stat.name, s.base_stat])),
    };

    if (cacheReady) {
      await redis.set(cacheKey, JSON.stringify(lean), { EX: CACHE_TTL_POKEMON_SECONDS });
    }

    res.json(lean);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch Pokémon.' });
  }
});

/**
 * /api/list bleibt UNVERÄNDER
 */
app.get('/api/list', async (_, res) => {
  try {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
    res.json(data.results.map((p) => p.name));
  } catch {
    res.status(500).json({ error: 'Could not fetch Pokémon list.' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
