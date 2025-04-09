import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

export default function LoginRegister({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setIsLoggedIn(true);
      setLoggedUser(storedUser);
    }
  }, []);

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
      setMessage("Käyttäjä luotu: " + response.data.name);
      setUserName("");
      setPassword("");
      setName("");
      setEmail("");
    } catch (error) {
      setMessage("Rekisteröinti epäonnistui: " + (error.response?.data?.error || error.message));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: userName,
        password,
      });
  
      //  Tallenna token käyttöä varten!
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
        {isLoggedIn ? (
          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Kirjaudu ulos ({loggedUser})
          </button>
        ) : (
          <>
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

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
