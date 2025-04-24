// Tuodaan Reactin hookit ja axios HTTP-pyyntöihin
import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

// LoginRegister-komponentti ottaa vastaan propsin `onLoginSuccess`
export default function LoginRegister({ onLoginSuccess }) {
  // Hallitaan aktiivista välilehteä (login tai register)
  const [activeTab, setActiveTab] = useState("login");

  // Tilamuuttujat käyttäjän tunnistautumista varten
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Tilamuuttujat rekisteröintiin
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Muut tilamuuttujat
  const [message, setMessage] = useState(""); // Näytettävä viesti
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Onko käyttäjä kirjautunut
  const [loggedUser, setLoggedUser] = useState(""); // Kirjautuneen käyttäjän nimi

  // Tarkista onko käyttäjä jo kirjautunut (esim. sivun latauksen yhteydessä)
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setIsLoggedIn(true);
      setLoggedUser(storedUser);
    }
  }, []);

  // Käyttäjän rekisteröinti
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/users", {
        name,
        email,
        username: userName,
        password,
      });

      // Jos rekisteröinti onnistuu ja saadaan token ja userId
      if (response.data.token && response.data.userId) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", userName);
        setIsLoggedIn(true);
        setLoggedUser(userName);
      }

      setMessage("Käyttäjä luotu: " + response.data.name);

      // Tyhjennä lomakekentät
      setUserName("");
      setPassword("");
      setName("");
      setEmail("");
    } catch (error) {
      setMessage("Rekisteröinti epäonnistui: " + (error.response?.data?.error || error.message));
    }
  };

  // Käyttäjän kirjautuminen
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: userName,
        password,
      });

      // Tallenna kirjautumistiedot localStorageen
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("username", userName);

      setIsLoggedIn(true);
      setLoggedUser(userName);
      setMessage("Tervetuloa, " + userName + "!");
      setActiveTab(""); // Piilota lomake

      if (onLoginSuccess) onLoginSuccess(response.data.userId);
    } catch (error) {
      setMessage("Kirjautuminen epäonnistui: " + (error.response?.data?.error || error.message));
    }
  };

  // Kirjautumisen purkaminen
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
        {/* Näytä uloskirjautumispainike, jos käyttäjä on kirjautunut */}
        {isLoggedIn ? (
          <button className="btn btn-danger" onClick={handleLogout}>
            Kirjaudu ulos ({loggedUser})
          </button>
        ) : (
          <>
            {/* Vaihda kirjautumis- tai rekisteröitymisnäkymään */}
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

      {/* Kirjautumislomake */}
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

      {/* Rekisteröitymislomake */}
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

      {/* Viestit käyttäjälle (esim. virheilmoitukset) */}
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
