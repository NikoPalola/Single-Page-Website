const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Tietokantayhteys SQLite:llä
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './Tietokanta.db',
    logging: true // Näyttää SQL-komennot konsolissa
});

// Käyttäjätaulu
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true }
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

// Määritetään suhde käyttäjän ja auton välillä (käyttäjä voi lisätä autoja myyntiin)
User.hasMany(Car, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
Car.belongsTo(User, { foreignKey: 'sellerId' });

// Synkronointi tietokannan kanssa
sequelize.sync()
    .then(() => console.log("Tietokanta synkronoitu"))
    .catch(err => console.error("Virhe tietokannan synkronoinnissa:", err));

// ** Käyttäjäreitit **
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ error: 'Nimi ja sähköposti vaaditaan' });
        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { name, email } = req.body;
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
        user.name = name;
        user.email = email;
        await user.save();
        res.json({ message: 'Käyttäjätiedot päivitetty', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
        await user.destroy();
        res.json({ message: 'Käyttäjä poistettu', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ** Autoreitit **
app.post('/cars', async (req, res) => {
    try {
        const { brand, model, year, kilometers, price, description, sellerId } = req.body;
        if (!brand || !model || !year || !price || !sellerId) {
            return res.status(400).json({ error: 'Kaikki tiedot ovat pakollisia' });
        }
        const car = await Car.create({ brand, model, year, kilometers, price, description, sellerId });
        res.status(201).json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.findAll({ include: User });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByPk(id, { include: User });
        if (!car) return res.status(404).json({ error: 'Autoa ei löytynyt' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/cars/:id', async (req, res) => {
    try {
        const { brand, model, year, kilometers, price, description, sellerId } = req.body;
        const { id } = req.params;

        // Haetaan auto tietokannasta
        const car = await Car.findByPk(id);
        if (!car) return res.status(404).json({ error: 'Autoa ei löytynyt' });

        // Tarkistetaan, onko käyttäjä auton omistaja
        if (car.sellerId !== sellerId) {
            return res.status(403).json({ error: 'Ei oikeuksia muokata tätä autoa' });
        }

        // Päivitetään auton tiedot
        car.brand = brand;
        car.model = model;
        car.year = year;
        car.kilometers = kilometers;
        car.price = price;
        car.description = description;
        await car.save();

        res.json({ message: 'Auton tiedot päivitetty', car });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { sellerId } = req.body; // Saadaan käyttäjän ID pyynnöstä

        // Haetaan auto tietokannasta
        const car = await Car.findByPk(id);
        if (!car) return res.status(404).json({ error: 'Autoa ei löytynyt' });

        // Tarkistetaan, onko käyttäjä auton myyjä
        if (car.sellerId !== sellerId) {
            return res.status(403).json({ error: 'Ei oikeuksia poistaa tätä autoa' });
        }

        // Poistetaan auto
        await car.destroy();
        res.json({ message: 'Auto poistettu', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Käynnistetään palvelin
app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});
