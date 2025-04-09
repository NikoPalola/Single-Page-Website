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

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './Tietokanta.db',
  logging: false
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

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

User.hasMany(Car, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
Car.belongsTo(User, { foreignKey: 'sellerId' });

sequelize.sync()
  .then(() => console.log("Tietokanta synkronoitu"))
  .catch(err => console.error("Synkronointivirhe:", err));

// Kirjautuminen
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(401).json({ error: 'Käyttäjää ei löytynyt' });
  
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Virheellinen salasana' });
  
      const token = jwt.sign(
        { id: user.id, username: user.username },
        'salainenavain',
        { expiresIn: '1h' }
      );
  
      // Palauta myös userId
      res.json({ 
        token,
        userId: user.id 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// JWT tarkistus
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

// Auton lisääminen
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
// Hae käyttäjän omat autot
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
  // Päivitä auto
app.put("/cars/:id", authenticateJWT, async (req, res) => {
    const carId = req.params.id;
    const { brand, model, year, kilometers, price, sellerId } = req.body;
  
    try {
      const car = await Car.findByPk(carId);
  
      // Varmistetaan, että auto kuuluu kirjautuneelle käyttäjälle
      if (car.sellerId !== req.user.id) {
        return res.status(403).json({ error: "Et voi muokata toisen käyttäjän autoa." });
      }
  
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
  
  // Poista auto
  app.delete("/cars/:id", authenticateJWT, async (req, res) => {
    const carId = req.params.id;
  
    try {
      const car = await Car.findByPk(carId);
  
      // Varmistetaan, että auto kuuluu kirjautuneelle käyttäjälle
      if (car.sellerId !== req.user.id) {
        return res.status(403).json({ error: "Et voi poistaa toisen käyttäjän autoa." });
      }
  
      await car.destroy();
      res.json({ message: "Auto poistettu myynnistä." });
    } catch (error) {
      res.status(500).json({ error: "Virhe poistaessa autoa" });
    }
  });
  
// Hae kaikki autot, mukaan lukien myyjän tiedot
app.get("/cars", async (req, res) => {
    try {
      const cars = await Car.findAll({
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['username'], // tuo vain username
        },
      });
      res.json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Virhe haettaessa autoja" });
    }
  });
  
 // Hae käyttäjä tiedot
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
  
  // Päivitä käyttäjä
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
  
  // Poista käyttäjä
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
  

app.listen(port, () => {
  console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});
