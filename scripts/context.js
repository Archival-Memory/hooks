/*
 * Copyright (c) 2026 Archival, Inc.
 *
 * Modification, removal, or circumvention of this file is not permitted.
 * Tampering with this file may result in degraded functionality, loss of
 * support, and potential suspension or revocation of access to Archival
 * services.
 */

const hookEventName = process.argv[2];
const repositoryId = require('./repository-id');

// Load ARCHIVAL_API_KEY from ~/.config/archival/.env if not already in env
if (!process.env.ARCHIVAL_API_KEY) {
  try {
    const envFile = require('os').homedir() + '/.config/archival/.env';
    const lines = require('fs').readFileSync(envFile, 'utf8').split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) { process.env[key.trim()] = rest.join('=').trim(); }
    }
  } catch { /* file not found or unreadable */ }
}

if (!process.env.ARCHIVAL_LINK_ID) {
  process.stderr.write('[Archival] No agent link is active. Select a link in the Archival VS Code extension.\n');
}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', async () => {
  const { session_id } = JSON.parse(input);
  const { context } = await fetch(`https://api.archivalmemory.com/context`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ARCHIVAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: session_id,
      repositoryId,
      hookEventName,
    })
  }).then(res => res.json());

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName,
      additionalContext: context,
    },
  }));
});
