const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));

// ── Health check — open http://localhost:3001/api/health to verify server + key
app.get('/api/health', (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(500).json({
      ok: false,
      error: 'ANTHROPIC_API_KEY is missing or still set to placeholder value.',
      fix: 'Open your .env file and set: ANTHROPIC_API_KEY=sk-ant-xxxxx',
    });
  }
  res.json({
    ok: true,
    message: 'Server is running and API key is set ✅',
    keyPreview: apiKey.slice(0, 14) + '...',
  });
});

// ── Claude proxy
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('❌ ANTHROPIC_API_KEY not set in .env file');
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not set',
      fix: 'Create a .env file in your project root with: ANTHROPIC_API_KEY=sk-ant-xxxxx',
    });
  }

  console.log('📤 Forwarding request to Anthropic API...');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Anthropic API error:', response.status, data);
      return res.status(response.status).json(data);
    }

    console.log('✅ Anthropic responded successfully');
    res.status(200).json(data);

  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to reach Anthropic API', details: err.message });
  }
});

app.listen(PORT, () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log(`\n✅ Proxy server running at http://localhost:${PORT}`);
  console.log(`   React app:   http://localhost:3000`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('\n⚠️  WARNING: ANTHROPIC_API_KEY is not set in your .env file!');
    console.log('   AI features will not work until you add your key.\n');
  } else {
    console.log(`   API Key: ${apiKey.slice(0, 14)}... ✅\n`);
  }
});