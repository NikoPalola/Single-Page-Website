import { useState } from "react";
import axios from "axios";  // Tuodaan Axios käyttöön
import "../index.css";

function CreateCar({ onCarAdded, buttonClass }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Hae token kirjautumisesta
    if (!token) {
      setMessage("Et ole kirjautunut sisään.");
      return;
    }

    try {
      // Käytetään Axiosia HTTP POST -pyynnön tekemiseen
      const response = await axios.post("http://localhost:3000/cars", 
        { brand, model, year, kilometers, price }, 
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Auto lisätty onnistuneesti!");
        setBrand(""); setModel(""); setYear(""); setKilometers(""); setPrice("");
        if (onCarAdded) onCarAdded();  // Kutsutaan callback funktiota, jos se on määritelty
      }
    } catch (err) {
      // Virheenkäsittely Axiosin avulla
      setMessage("Virhe lisättäessä autoa: " + (err.response ? err.response.data.error : err.message));
    }
  };

  return (
    <div>
      <h2>Myy autosi</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Merkki" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        <input type="text" placeholder="Malli" value={model} onChange={(e) => setModel(e.target.value)} required />
        <input type="number" placeholder="Vuosimalli" value={year} onChange={(e) => setYear(e.target.value)} required />
        <input type="number" placeholder="Kilometrit" value={kilometers} onChange={(e) => setKilometers(e.target.value)} required />
        <input type="number" placeholder="Hinta" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <button type="submit" className={buttonClass}>Luo uusi myynti-ilmoitus</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateCar;
