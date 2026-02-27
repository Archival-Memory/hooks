/*
 * Copyright (c) 2026 Archival, Inc.
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  const event = JSON.parse(input);
  process.stdout.write(JSON.stringify({ continue: true }));
});


