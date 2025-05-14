const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MariaDB username
  password: '', // Replace with your MariaDB password
  database: 'healthhub_sql', // Replace with your database name
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});