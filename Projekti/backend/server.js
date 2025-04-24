// Vaadittavien moduulien tuonti
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Middlewaret
app.use(cors()); // Sallii pyynnöt muista domaineista
app.use(express.json()); // JSON-bodyjen parsinta
app.use(express.static(path.join(__dirname, 'public'))); // Palvellaan staattisia tiedostoja

// Sequelize-kannan alustaminen
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './Tietokanta.db',
  logging: false
});

// Käyttäjätaulun määrittely
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

// Autotaulun määrittely
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

// Taulujen välinen suhde: yksi käyttäjä voi myydä useita autoja
User.hasMany(Car, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
Car.belongsTo(User, { foreignKey: 'sellerId' });

// Tietokannan synkronointi
sequelize.sync()
  .then(() => console.log("Tietokanta synkronoitu"))
  .catch(err => console.error("Synkronointivirhe:", err));

// =======================
// Käyttäjän rekisteröinti
// =======================
app.post('/users', async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: 'Kaikki kentät ovat pakollisia' });
  }

  try {
    // Tarkistetaan, onko käyttäjänimi jo olemassa
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Käyttäjänimi on jo käytössä' });
    }

    // Salasanan hashaus ja käyttäjän tallennus
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Virhe käyttäjää luodessa' });
  }
});

// ===================
// Käyttäjän kirjautuminen
// ===================
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Käyttäjänimi ja salasana vaaditaan" });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Väärä käyttäjänimi tai salasana" });
    }

    // Tarkistetaan salasana
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Väärä käyttäjänimi tai salasana" });
    }

    // Luodaan JWT-token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      'salainenavain',
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Virhe kirjautumisessa" });
  }
});

// ==========================
// JWT-autentikointi middleware
// ==========================
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: "Token puuttuu" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'salainenavain', (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Virheellinen token" });
    }
    req.user = user;
    next();
  });
};

// ======================
// Auton lisääminen
// ======================
app.post("/cars", authenticateJWT, async (req, res) => {
  const { brand, model, year, kilometers, price, description } = req.body;

  if (!brand || !model || !year || !kilometers || !price) {
    return res.status(400).json({ error: "Kaikki kentät ovat pakollisia" });
  }

  try {
    const newCar = await Car.create({
      brand,
      model,
      year: parseInt(year),
      kilometers: parseInt(kilometers),
      price: parseFloat(price),
      description: description || "",
      sellerId: req.user.id
    });

    res.json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Virhe auton lisäyksessä" });
  }
});

// ============================
// Hae kirjautuneen käyttäjän autot
// ============================
app.get("/cars/user", authenticateJWT, async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: {
        model: User,
        attributes: ['username'],
      },
    });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Virhe haettaessa autoja" });
  }
});

// ======================
// Päivitä auton tiedot
// ======================
app.put("/cars/:id", authenticateJWT, async (req, res) => {
  const carId = req.params.id;
  const { brand, model, year, kilometers, price } = req.body;

  try {
    const car = await Car.findByPk(carId);

    if (car.sellerId !== req.user.id) {
      return res.status(403).json({ error: "Et voi muokata toisen käyttäjän autoa." });
    }

    // Päivitetään kentät
    car.brand = brand;
    car.model = model;
    car.year = year;
    car.kilometers = kilometers;
    car.price = price;

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: "Virhe päivittäessä autoa" });
  }
});

// ======================
// Poista auton myynti
// ======================
app.delete("/cars/:id", authenticateJWT, async (req, res) => {
  const carId = req.params.id;

  try {
    const car = await Car.findByPk(carId);

    if (car.sellerId !== req.user.id) {
      return res.status(403).json({ error: "Et voi poistaa toisen käyttäjän autoa." });
    }

    await car.destroy();
    res.json({ message: "Auto poistettu myynnistä." });
  } catch (error) {
    res.status(500).json({ error: "Virhe poistaessa autoa" });
  }
});

// ==============================
// Hae kaikki autot + myyjän nimi
// ==============================
app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.findAll({
      order: [['createdAt', 'DESC']],
      include: {
        model: User,
        attributes: ['username'],
      },
    });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Virhe haettaessa autoja" });
  }
});

// ======================
// Hae yksittäinen käyttäjä
// ======================
app.get('/users/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) return res.status(404).json({ error: 'Käyttäjää ei löydy' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Virhe käyttäjän hakemisessa' });
  }
});

// ======================
// Päivitä käyttäjä
// ======================
app.put('/users/:id', authenticateJWT, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: 'Käyttäjää ei löydy' });
    if (user.id !== req.user.id) return res.status(403).json({ error: 'Ei oikeuksia päivittää' });

    user.name = name;
    user.email = email;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Virhe päivittäessä käyttäjää' });
  }
});

// ======================
// Poista käyttäjä
// ======================
app.delete('/users/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: 'Käyttäjää ei löydy' });
    if (user.id !== req.user.id) return res.status(403).json({ error: 'Ei oikeuksia poistaa' });

    await user.destroy();
    res.status(200).json({ message: 'Käyttäjä poistettu' });
  } catch (error) {
    res.status(500).json({ error: 'Virhe poistaessa käyttäjää' });
  }
});

// ======================
// Palvelimen käynnistys
// ======================
app.listen(port, () => {
  console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});
