const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Lisää tämä rivi

const app = express();
const port = 3000;

// Käytetään JSON-middlewarea POST-datan käsittelyyn
app.use(express.json());

// Palvele index.html-tiedosto
app.use(express.static(path.join(__dirname, 'public'))); // Lisää tämä rivi

// Yhdistä SQLite-tietokantaan
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Tietokantavirhe:', err.message);
    } else {
        console.log('Yhteys SQLite-tietokantaan onnistui.');
    }
});

// Luo taulu, jos sitä ei ole olemassa
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE
)`);

// Luo uusi käyttäjä (Create)
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Nimi ja sähköposti vaaditaan' });
    }

    const query = `INSERT INTO users (name, email) VALUES (?, ?)`;
    db.run(query, [name, email], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, email });
    });
});

// Hae kaikki käyttäjät (Read)
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Päivitä käyttäjän tiedot (Update)
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;

    if (!name || !email) {
        return res.status(400).json({ error: 'Nimi ja sähköposti vaaditaan' });
    }

    const query = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    db.run(query, [name, email, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
        }
        res.json({ message: 'Käyttäjän tiedot päivitetty', id });
    });
});

// Poista käyttäjä (Delete)
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM users WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
        }
        res.json({ message: 'Käyttäjä poistettu', id });
    });
});

// Käynnistä palvelin
app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});