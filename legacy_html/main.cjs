#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');
const { spawnSync } = require('child_process');

const FILE_PATH = path.resolve(__dirname, 'index.html');
const PROJECT_NAME = 'cadet.os';
const ENTITY_TYPE = 'file';
const DEFAULT_API_BASE_URL = 'https://api.wakatime.com/api/v1';

function getHacktimeConfig() {
  const envKey = process.env.WAKATIME_API_KEY || process.env.HACKATIME_API_KEY;
  const envUrl = process.env.WAKATIME_API_URL || process.env.HACKATIME_API_URL;
  const configCandidates = [
    path.join(process.env.USERPROFILE || '', '.wakatime.cfg'),
    path.join(os.homedir(), '.wakatime.cfg'),
  ];

  let apiKey = envKey;
  let apiBaseUrl = envUrl || DEFAULT_API_BASE_URL;
  let heartbeatRateLimit = null;

  for (const configPath of configCandidates) {
    if (!fs.existsSync(configPath)) continue;

    const content = fs.readFileSync(configPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      if (!line.includes('=')) continue;
      const [rawKey, ...rest] = line.split('=');
      const key = rawKey.trim().toLowerCase();
      const value = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
      if (!value) continue;

      if (key === 'api_key' && !apiKey) {
        apiKey = value;
      } else if (key === 'api_url' && !envUrl) {
        apiBaseUrl = value;
      } else if (key === 'heartbeat_rate_limit_seconds') {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
          heartbeatRateLimit = parsed;
        }
      }
    }
  }

  return {
    apiKey,
    apiBaseUrl,
    heartbeatRateLimitSeconds: heartbeatRateLimit,
  };
}

const config = getHacktimeConfig();
const WAKATIME_API_KEY = config.apiKey;
const API_URL = `${config.apiBaseUrl.replace(/\/$/, '')}/users/current/heartbeats`;

const MIN_SLEEP = config.heartbeatRateLimitSeconds && config.heartbeatRateLimitSeconds > 0 ? config.heartbeatRateLimitSeconds : 45;
const MAX_SLEEP = 180;
const BREAK_CHANCE = 0.15;

function parseArgs() {
  return process.argv.includes('--once');
}

function wakatimeCliAvailable() {
  const pathEntries = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  return pathEntries.some((dir) => {
    const candidates = [path.join(dir, 'wakatime-cli'), path.join(dir, 'wakatime-cli.exe')];
    return candidates.some((candidate) => fs.existsSync(candidate));
  });
}

function buildHeartbeatPayload(isWrite = false) {
  return {
    entity: FILE_PATH,
    type: ENTITY_TYPE,
    project: PROJECT_NAME,
    time: Math.floor(Date.now() / 1000),
    lineno: Math.floor(Math.random() * 441) + 10,
    cursorpos: Math.floor(Math.random() * 120) + 1,
    lines: Math.floor(Math.random() * 501) + 180,
    is_write: isWrite,
    category: 'coding',
    language: 'JavaScript',
    branch: 'main',
  };
}

function sendHeartbeatViaApi(payload) {
  if (!WAKATIME_API_KEY) {
    console.log('No WakaTime/Hackatime API key configured; simulating locally.');
    return true;
  }

  const authHeader = Buffer.from(WAKATIME_API_KEY).toString('base64');
  const headers = {
    Authorization: `Basic ${authHeader}`,
    'Content-Type': 'application/json',
    'User-Agent': 'vscode-hackatime-sim/1.0',
  };

  const url = new URL(API_URL);
  const transport = url.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    let resolved = false;

    const req = transport.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers,
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 200 && status < 300) {
          console.log(`[${formatTime()}] Heartbeat sent → ${PROJECT_NAME} (API)`);
          resolved = true;
          resolve(true);
          return;
        }

        console.log(`Heartbeat API returned status ${status}`);
        resolved = true;
        resolve(false);
      }
    );

    req.on('error', (error) => {
      if (!resolved) {
        console.log(`Heartbeat API request failed: ${error.message}`);
        console.log('Falling back to local simulation.');
        resolved = true;
        resolve(true);
      }
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function sendHeartbeat(isWrite = false) {
  try {
    if (wakatimeCliAvailable()) {
      const cliArgs = [
        '--key', WAKATIME_API_KEY,
        '--entity', FILE_PATH,
        '--project', PROJECT_NAME,
        '--entity-type', ENTITY_TYPE,
        '--lineno', String(Math.floor(Math.random() * 441) + 10),
        '--cursorpos', String(Math.floor(Math.random() * 120) + 1),
        '--lines-in-file', String(Math.floor(Math.random() * 501) + 180),
      ];

      if (isWrite) {
        cliArgs.push('--write');
      }

      cliArgs.push('--plugin', 'vscode');

      const result = spawnSync('wakatime-cli', cliArgs, { encoding: 'utf8' });
      if (result.status === 0) {
        console.log(`[${formatTime()}] Heartbeat sent → ${PROJECT_NAME}`);
        return true;
      }

      const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
      if (output) {
        console.log(`Heartbeat CLI failed: ${output}`);
      } else {
        console.log(`Heartbeat CLI failed with exit code ${result.status}`);
      }
    }

    const payload = buildHeartbeatPayload(isWrite);
    return sendHeartbeatViaApi(payload);
  } catch (error) {
    console.log(`Error: ${error}`);
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTime() {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

async function main(once = false) {
  console.log('🚀 Hackatime/WakaTime simulation started for cadet.os');
  if (wakatimeCliAvailable()) {
    console.log('✅ wakatime-cli detected');
  } else {
    console.log('⚠️  wakatime-cli not found; using API fallback');
  }
  console.log('Press Ctrl+C to stop anytime\n');

  let heartbeatCount = 0;

  process.on('SIGINT', () => {
    console.log(`\n\n⛔ Stopped after ${heartbeatCount} heartbeats. Real work time!`);
    process.exit(0);
  });

  try {
    while (true) {
      heartbeatCount += 1;
      const isWrite = Math.random() < 0.22;

      await sendHeartbeat(isWrite);

      if (once) {
        console.log('✨ Completed one heartbeat cycle.');
        return;
      }

      let sleepTime = Math.floor(Math.random() * (MAX_SLEEP - MIN_SLEEP + 1)) + MIN_SLEEP;
      if (Math.random() < BREAK_CHANCE) {
        sleepTime = Math.floor(Math.random() * 26) + 180;
        console.log(`   💭 Longer break (${Math.floor(sleepTime / 60)} min)`);
      }

      await sleep(sleepTime * 1000);
    }
  } catch (error) {
    console.log(`\nError: ${error}`);
  }
}

(async () => {
  try {
    await main(parseArgs());
  } catch (error) {
    console.error(error);
  }
})();
