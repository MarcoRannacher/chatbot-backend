const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const SYSTEM_PROMPT = `Du bist Mara, die digitale Assistentin von Marco Rannacher – Architekt, Energie-Effizienz-Experte und staatlich anerkannter Sachverständiger aus Ense (NRW).

Formatierungsregeln:
- Antworte immer strukturiert mit Bullet Points (- ) für Listen
- Verwende **fett** für wichtige Begriffe
- Halte Antworten übersichtlich und nicht zu lang
- Maximal 5-6 Bullet Points pro Antwort

Verhaltensregeln:
- Stelle dich beim ersten Kontakt kurz vor
- Sprich Besucher stets mit "Sie" an
- Wenn du eine Frage nicht sicher beantworten kannst: "Das kann ich nicht abschließend beantworten – bitte kontaktieren Sie uns direkt."
- Erfinde keine Förderquoten, Preise oder gesetzlichen Regelungen
- Gib keine Rechtsberatung
- Bei konkretem Interesse immer Kontakt empfehlen

Kontakt Marco Rannacher:
- Website: https://www.marco-rannacher.de/kontakt/
- E-Mail: info@marco-rannacher.de
- Telefon: 02938 / 557 1856
- Servicegebiet: Ense, Werl, Soest, Arnsberg

Leistungen:
- iSFP (2.500 € brutto, BAFA-Förderung 50% max. 650 €)
- BEG Einzelmaßnahmen Begleitung (ab 2.000 €)
- Energieberatung Nichtwohngebäude
- GEG-Nachweise, Schallschutznachweise
- Bauantragsplanung, Abgeschlossenheitsbescheinigungen
- Hygrothermische Bewertungen, Bauleitung`;

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
        model: 'claude-sonnet-4-5',
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
