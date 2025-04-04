import { useState } from "react";
import '../index.css';

function CreateCar({ onCarAdded, buttonClass }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [price, setPrice] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, model, year, price, sellerId }),
    });

    if (response.ok) {
      onCarAdded();
      setBrand("");
      setModel("");
      setYear("");
      setKilometers("");
      setPrice("");
      setSellerId("");
    }
    if (response.ok) {
      setMessage("Auto lisätty onnistuneesti!");
    } else {
      setMessage("Virhe lisättäessä autoa.");
    }
    
  };

  return (
    <div>
    <h2>Myy autosi</h2>
    <form onSubmit={handleSubmit}>
    <input
        type="text"
        placeholder="Merkki"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Malli"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Vuosimalli"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Kilometrit"
        value={kilometers}
        onChange={(e) => setKilometers(e.target.value)}
        required
      />
       <input
        type="number"
        placeholder="Hinta"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
       <input
        type="number"
        placeholder="Myynti ID"
        value={sellerId}
        onChange={(e) => setSellerId(e.target.value)}
        required
      />
      <button type="submit" className={buttonClass}>Luo uusi myynti listaus</button>
    </form>
    {message && <p>{message}</p>}
  </div>
  );
}

export default CreateCar;
