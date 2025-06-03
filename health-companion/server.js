const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'healthhub_sql', 
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

// API to fetch symptom recommendations
app.get('/symptom-recommendations', (req, res) => {
  const query = 'SELECT * FROM symptom_recommendations';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get('/symptoms/:bodyPart', (req, res) => {
  const bodyPart = req.params.bodyPart;
  const query = 'SELECT DISTINCT symptom FROM symptom_recommendations WHERE body_part = ?';
  db.query(query, [bodyPart], (err, results) => {
    if (err) {
      console.error('Error fetching symptoms:', err);
      res.status(500).send({ error: 'Failed to fetch symptoms' });
      return;
    }
    res.json(results);
  });
});

app.get('/otc-medicines/:symptom', (req, res) => {
  const symptom = req.params.symptom;
  const query = 'SELECT DISTINCT medicine_name, medicine_description FROM symptom_recommendations WHERE symptom = ?';
  db.query(query, [symptom], (err, results) => {
    if (err) {
      console.error('Error fetching OTC medicines:', err);
      res.status(500).send({ error: 'Failed to fetch OTC medicines' });
      return;
    }
    res.json(results);
  });
});

app.get('/foods', (req, res) => {
  const query = 'SELECT DISTINCT food_suggestion FROM symptom_recommendations WHERE food_suggestion IS NOT NULL';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching foods:', err);
      res.status(500).send({ error: 'Failed to fetch foods' });
      return;
    }
    res.json(results);
  });
});

app.get('/foods/:symptom', (req, res) => {
  const symptom = req.params.symptom;
  const query = 'SELECT DISTINCT food_suggestion FROM symptom_recommendations WHERE symptom = ?';
  db.query(query, [symptom], (err, results) => {
    if (err) {
      console.error('Error fetching foods:', err);
      res.status(500).send({ error: 'Failed to fetch foods' });
      return;
    }
    res.json(results);
  });
});

app.get('/exercises', (req, res) => {
  const query = 'SELECT DISTINCT exercise FROM symptom_recommendations WHERE exercise IS NOT NULL';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching exercises:', err);
      res.status(500).send({ error: 'Failed to fetch exercises' });
      return;
    }
    res.json(results);
  });
});

app.get('/exercises/:symptom', (req, res) => {
  const symptom = req.params.symptom;
  const query = 'SELECT DISTINCT exercise FROM symptom_recommendations WHERE symptom = ?';
  db.query(query, [symptom], (err, results) => {
    if (err) {
      console.error('Error fetching exercises:', err);
      res.status(500).send({ error: 'Failed to fetch exercises' });
      return;
    }
    res.json(results);
  });
});

// Example Node.js/Express route
app.get('/body-parts/:region', (req, res) => {
  const region = req.params.region;
  const query = `SELECT DISTINCT body_part FROM symptom_recommendations WHERE body_region = ?`;
  db.query(query, [region], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching body parts');
    } else {
      res.json(results);
    }
  });
});

const genAI = new GoogleGenerativeAI('AIzaSyCAna421OiIapQclw9VTxU3E8FLOnApzdk');

app.post("/ask-gemini", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const reply = result.response.text();
    res.json({ reply });
  } catch (e) {
    console.error("Gemini AI error:", e);
    // Check for quota error
    if (e.status === 429 || (e.message && e.message.includes('quota'))) {
      res.status(429).json({ reply: "You have reached your Gemini AI quota. Please try again later or check your billing/quota settings." });
    } else {
      res.status(500).json({ reply: "Gemini AI error." });
    }
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});