// Tuodaan Reactin hookit sekä axios HTTP-pyyntöjä varten
import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

// LoginRegister-komponentti vastaanottaa `onLoginSuccess`-propin, jota kutsutaan onnistuneen kirjautumisen jälkeen
export default function LoginRegister({ onLoginSuccess }) {
  // Määritetään, mikä välilehti on aktiivinen: kirjautuminen vai rekisteröityminen
  const [activeTab, setActiveTab] = useState("login");

  // Lomakkeen tilamuuttujat kirjautumista ja rekisteröitymistä varten
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Käyttäjän koko nimi
  const [email, setEmail] = useState(""); // Käyttäjän sähköposti

  // Muita tiloja: viestit ja kirjautumisen tila
  const [message, setMessage] = useState(""); // Näytettävä virhe- tai onnistumisviesti
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kirjautumisen tila
  const [loggedUser, setLoggedUser] = useState(""); // Kirjautuneen käyttäjän nimi

  // Tarkista automaattisesti localStoragesta, onko käyttäjä jo kirjautunut aiemmin
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setIsLoggedIn(true);
      setLoggedUser(storedUser);
    }
  }, []);

  // Käsittelee uuden käyttäjän rekisteröinnin
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Lähetetään rekisteröintitiedot backendille
      const response = await axios.post("http://localhost:3000/users", {
        name,
        email,
        username: userName,
        password,
      });

      // Tallennetaan käyttäjätiedot localStorageen, jos rekisteröinti onnistuu
      if (response.data.token && response.data.userId) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", userName);
        setIsLoggedIn(true);
        setLoggedUser(userName);
      }

      // Näytetään onnistumisviesti
      setMessage("Käyttäjä luotu: " + response.data.name);

      // Tyhjennetään lomakekentät
      setUserName("");
      setPassword("");
      setName("");
      setEmail("");
    } catch (error) {
      // Näytetään virheviesti, jos jotain menee pieleen
      setMessage("Rekisteröinti epäonnistui: " + (error.response?.data?.error || error.message));
    }
  };

  // Käsittelee kirjautumisen
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Lähetetään kirjautumistiedot backendille
      const response = await axios.post("http://localhost:3000/login", {
        username: userName,
        password,
      });

      // Tallennetaan token ja käyttäjätiedot localStorageen
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("username", userName);

      setIsLoggedIn(true);
      setLoggedUser(userName);
      setMessage("Tervetuloa, " + userName + "!");
      setActiveTab(""); // Piilotetaan lomake

      // Ilmoitetaan kirjautuminen vanhemmalle komponentille
      if (onLoginSuccess) onLoginSuccess(response.data.userId);
    } catch (error) {
      // Näytetään virheviesti
      setMessage("Kirjautuminen epäonnistui: " + (error.response?.data?.error || error.message));
    }
  };

  // Kirjaa käyttäjän ulos ja tyhjentää tilat
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setLoggedUser("");
    setUserName("");
    setPassword("");
    setActiveTab("login");
    setMessage("Olet kirjautunut ulos.");
  };

  return (
    <div className="login-register-container">
      <div className="tab-buttons mb-3">
        {/* Jos käyttäjä on kirjautunut, näytetään uloskirjautumispainike */}
        {isLoggedIn ? (
          <button className="btn btn-danger" onClick={handleLogout}>
            Kirjaudu ulos ({loggedUser})
          </button>
        ) : (
          <>
            {/* Vaihtopainikkeet kirjautumisen ja rekisteröinnin välillä */}
            <button
              className={`btn ${activeTab === "login" ? "btn-secondary" : "btn-outline-secondary"} me-2`}
              onClick={() => setActiveTab("login")}
            >
              Kirjaudu
            </button>
            <button
              className={`btn ${activeTab === "register" ? "btn-secondary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("register")}
            >
              Luo käyttäjä
            </button>
          </>
        )}
      </div>

      {/* Kirjautumislomake näkyy vain, jos käyttäjä ei ole kirjautunut ja "login"-välilehti on aktiivinen */}
      {!isLoggedIn && activeTab === "login" && (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Käyttäjänimi"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Kirjaudu</button>
        </form>
      )}

      {/* Rekisteröitymislomake näkyy vain, jos käyttäjä ei ole kirjautunut ja "register"-välilehti on aktiivinen */}
      {!isLoggedIn && activeTab === "register" && (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Käyttäjänimi"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nimi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success">Luo käyttäjä</button>
        </form>
      )}

      {/* Näytetään mahdollinen viesti käyttäjälle (esim. virhe tai onnistuminen) */}
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
