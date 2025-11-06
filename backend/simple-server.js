
const express = require('express');
const app = express();
const port = 3003;

app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('Received webhook data:', req.body);
  res.status(200).send('Webhook received');
});

app.listen(port, () => {
  console.log(`Simple server listening at http://localhost:${port}`);
});
