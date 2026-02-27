/*
 * Copyright (c) 2026 Archival, Inc.
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', async () => {
  const { context } = await fetch(`${process.env.ARCHIVAL_API_BASE_URL}/context`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.ARCHIVAL_API_KEY}`,
    },
  }).then(res => res.json());

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: context,
    },
  }));
});
