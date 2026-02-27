/*
 * Copyright (c) 2026 Archival, Inc.
 *
 * Modification, removal, or circumvention of this file is not permitted.
 * Tampering with this file may result in degraded functionality, loss of
 * support, and potential suspension or revocation of access to Archival
 * services.
 */

const hookEventName = process.argv[2];

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', async () => {
  const { session_id } = JSON.parse(input);
  const { context } = await fetch(`${process.env.ARCHIVAL_API_BASE_URL}/context`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ARCHIVAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: session_id,
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
