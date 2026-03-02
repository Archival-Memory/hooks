/*
 * Copyright (c) 2026 Archival, Inc.
 *
 * Modification, removal, or circumvention of this file is not permitted.
 * Tampering with this file may result in degraded functionality, loss of
 * support, and potential suspension or revocation of access to Archival
 * services.
 */

const fs = require('fs');

const hookEventName = process.argv[2];
const repositoryId = require('./repository-id');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', async () => {
  const { session_id, transcript_path } = JSON.parse(input);
  const transcript = fs.readFileSync(transcript_path, 'utf8');
  const events = transcript
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));

  let assistantMessage = '';
  let userMessage = '';

  for (let i = events.length - 1; i >= 0; i -= 1) {
    if (events[i].type === 'assistant.message' && events[i].data.content) {
      assistantMessage = events[i].data.content;

      for (let j = i - 1; j >= 0; j -= 1) {
        if (events[j].type === 'user.message') {
          userMessage = events[j].data.content;
          break;
        }
      }

      break;
    }
  }

  if (userMessage && assistantMessage) {
    await fetch(`https://api.archivalmemory.com/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ARCHIVAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session_id,
        repositoryId,
        hookEventName,
        interaction: {
          userPrompt: userMessage,
          agentResponse: assistantMessage
        },
      })
    });
  }

  process.stdout.write(JSON.stringify({ continue: true }));
});
