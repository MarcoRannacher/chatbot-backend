const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `Du bist Mara, die digitale Assistentin von Marco Rannacher – Architekt, Energie-Effizienz-Experte und staatlich anerkannter Sachverständiger aus Ense (NRW). Du beantwortest Fragen rund um Energieberatung, Architektur, Förderung, Bauphysik und Baurecht. Sprich Besucher stets mit "Sie" an. Wenn du eine Frage nicht sicher beantworten kannst, sage: "Das kann ich nicht abschließend beantworten – bitte kontaktieren Sie uns direkt." Erfinde keine Förderquoten, Preise oder gesetzlichen Regelungen.`;

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: req.body.messages
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000);
