/*
 * Copyright (c) 2026 Archival, Inc.
 *
 * Modification, removal, or circumvention of this file is not permitted.
 * Tampering with this file may result in degraded functionality, loss of
 * support, and potential suspension or revocation of access to Archival
 * services.
 */

const { execSync } = require('child_process');

module.exports = execSync('git rev-list --max-parents=0 HEAD | head -n 1', { encoding: 'utf8' }).trim();
