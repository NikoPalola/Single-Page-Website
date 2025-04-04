import { useState } from "react";
import axios from "axios";
import '../index.css';

export default function UpdateUser({ onUserUpdated, buttonClass = "btn btn-warning" }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleUpdate = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.put(`http://localhost:5173/users/${id}`, {
                name,
                email,
            });
            setMessage("User updated successfully: " + response.data.id);
            setId("");
            setName("");
            setEmail("");
            if (onUserUpdated) onUserUpdated(); // Kutsutaan päivitysfunktiota
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="update-user-container">
            <h2>Käyttäjätietojen päivitys</h2>
            <form onSubmit={handleUpdate} className="update-user-form">
                <input
                    type="text"
                    placeholder="Käyttäjätunnus"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Nimi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                />
                <button type="submit" className={buttonClass}>Päivitä</button>
            </form>
            {message &&  <p className="message">{message}</p>}
        </div>
    );
}