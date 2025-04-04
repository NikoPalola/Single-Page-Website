import { useState } from "react";
import axios from "axios";

export default function CreateUser({ onUserAdded, buttonClass = "btn btn-primary" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5173/users", {
        name,
        email,
      });
      setMessage("User created successfully: " + response.data.name);
      setName("");
      setEmail("");
      if (onUserAdded) onUserAdded(); // Kutsutaan päivitysfunktiota
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h2>Luo käyttäjä</h2>
      <form onSubmit={handleSubmit}>
      <input
          type="text"
          placeholder="Käyttäjänimi"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <button type="submit" className={buttonClass}>Luo uusi käyttäjä</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}