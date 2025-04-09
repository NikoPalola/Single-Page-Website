import { useEffect, useState } from "react";
import axios from "axios";
import '../index.css';

export default function UpdateUser({ onUserUpdated, buttonClass = "btn btn-warning" }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        
        const userId = localStorage.getItem("userId");
        console.log("User ID from localStorage:", userId);
        if (!userId) {
            console.error("User ID ei löydy!");
            setMessage("Ei löydy käyttäjää, ole hyvä ja kirjaudu sisään.");
            return;

    }
        setId(userId);


        axios.get(`http://localhost:3000/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then(res => {
            setName(res.data.name);
            setEmail(res.data.email);
        }).catch(err => {
            setMessage("Virhe haettaessa käyttäjän tietoja.");
        });
    
    }, []);

    const handleUpdate = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.put(`http://localhost:3000/users/${id}`, {
                name,
                email,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setMessage("Käyttäjä päivitetty onnistuneesti: " + response.data.id);
            if (onUserUpdated) onUserUpdated();
        } catch (error) {
            setMessage("Virhe: " + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Haluatko varmasti poistaa käyttäjätilisi?");
        if (!confirmed) return;

        try {
            const response = await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (response.status === 200) {
                setMessage("Käyttäjä poistettu.");
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else {
                setMessage("Poistaminen epäonnistui.");
            }
        } catch (error) {
            setMessage("Virhe poistettaessa käyttäjää.");
        }
    };

    return (
        <div className="update-user-container">
            <h2>Käyttäjätietojen päivitys</h2>
            <form onSubmit={handleUpdate} className="update-user-form">
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
                <button onClick={handleDelete} type="button" className="btn btn-danger mt-3">
                    Poista käyttäjätili
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}
