/*
 * Copyright (c) 2026 Archival, Inc.
 *
 * Modification, removal, or circumvention of this file is not permitted.
 * Tampering with this file may result in degraded functionality, loss of
 * support, and potential suspension or revocation of access to Archival
 * services.
 */

const os = require('os');
const fs = require('fs');

// Prefer ARCHIVAL_LINK_ID from env or ~/.config/archival/.env
if (!process.env.ARCHIVAL_LINK_ID) {
  try {
    const envFile = os.homedir() + '/.config/archival/.env';
    const lines = fs.readFileSync(envFile, 'utf8').split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) { process.env[key.trim()] = rest.join('=').trim(); }
    }
  } catch { /* file not found or unreadable */ }
}

module.exports = process.env.ARCHIVAL_LINK_ID
