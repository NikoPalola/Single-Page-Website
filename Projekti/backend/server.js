const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Tietokantayhteys SQLite:llä
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './Tietokanta.db',
    logging: true
});

// Käyttäjätaulu
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

// Autotaulu
const Car = sequelize.define('Car', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    kilometers: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    sellerId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

// Määritetään suhde käyttäjän ja auton välillä
User.hasMany(Car, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
Car.belongsTo(User, { foreignKey: 'sellerId' });

// Synkronointi tietokannan kanssa
sequelize.sync()
    .then(() => console.log("Tietokanta synkronoitu"))
    .catch(err => console.error("Virhe tietokannan synkronoinnissa:", err));

// ** Käyttäjäreitit **

// Kirjautumisreitti
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: 'Käyttäjätunnusta ei löytynyt' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Virheellinen salasana' });
        }

        // Luodaan JWT-tunnus ja lähetetään se käyttäjälle
        const token = jwt.sign({ id: user.id, username: user.username }, 'salainenavain', { expiresIn: '1h' });

        res.json({ token });  // Lähetetään token
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware tarkistaa JWT-tunnuksen ja liittää käyttäjän tiedot pyyntöön
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).send("Access denied.");
    }

    jwt.verify(token, 'salainenavain', (err, user) => {
        if (err) {
            return res.status(403).send("Invalid token.");
        }
        req.user = user;
        next();
    });
};

// ** Autoreitit **

app.post("/cars", authenticateJWT, async (req, res) => {
    const { brand, model, year, kilometers, price, description } = req.body;

    if (!brand || !model || !year || !kilometers || !price) {
        return res.status(400).json({ error: "Kaikki kentät ovat pakollisia" });
    }

    try {
        const sellerId = req.user.id; // Käytetään JWT:stä saatu käyttäjän ID

        // Tarkistetaan, että arvot ovat kelvollisia numeroita
        const yearNum = parseInt(year);
        const kilometersNum = parseInt(kilometers);
        const priceNum = parseFloat(price);

        if (isNaN(yearNum) || isNaN(kilometersNum) || isNaN(priceNum)) {
            return res.status(400).json({ error: "Kaikki kentät täytyy olla kelvollisia numeroita" });
        }

        // Luo uusi auto ja lisää sellerId automaattisesti
        const newCar = await Car.create({
            brand,
            model,
            year: yearNum,
            kilometers: kilometersNum,
            price: priceNum,
            description,
            sellerId
        });

        res.json(newCar);
    } catch (error) {
        console.error("Virhe auton lisäyksessä:", error);
        res.status(500).json({ error: "Virhe auton lisäyksessä" });
    }
});

// Käynnistetään palvelin
app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});
