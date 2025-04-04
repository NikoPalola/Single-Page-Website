import { useState } from "react";
import '../index.css';

// Auton tietojen päivittäminen ja poistaminen
function UpdateCar({ onCarUpdated, buttonClass }) {
  const [id, setId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  // Hakee auton tiedot myynti-ID:n perusteella
  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cars/${id}`);
      if (!response.ok) {
        setMessage("Autoa ei löytynyt!");
        return;
      }
      const car = await response.json();
      setBrand(car.brand);
      setModel(car.model);
      setYear(car.year);
      setKilometers(car.kilometers);
      setPrice(car.price);
      setMessage("");
    } catch (error) {
      setMessage("Virhe haettaessa tietoja.");
    }
  };

  // Päivittää auton tiedot
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, year, kilometers, price }),
      });

      if (response.ok) {
        setMessage("Auton tiedot päivitetty!");
        onCarUpdated();
      } else {
        setMessage("Päivitys epäonnistui.");
      }
    } catch (error) {
      setMessage("Virhe päivitettäessä tietoja.");
    }
  };

  // Poistaa auton myynnistä
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cars/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Auto poistettu myynnistä!");
        setId("");
        setBrand("");
        setModel("");
        setYear("");
        setKilometers("");
        setPrice("");
        onCarUpdated();
      } else {
        setMessage("Poisto epäonnistui.");
      }
    } catch (error) {
      setMessage("Virhe poistaessa autoa.");
    }
  };

  return (
    <div>
      <h2>Päivitä tai poista auto</h2>
      <input 
        type="number" 
        placeholder="Myynti ID" 
        value={id} 
        onChange={(e) => setId(e.target.value)} 
        className="form-control mb-2" 
        required 
      />
      <button onClick={fetchCarDetails} className="btn btn-info mb-3">Hae tiedot</button>

      <input 
        type="text" 
        placeholder="Merkki" 
        value={brand} 
        onChange={(e) => setBrand(e.target.value)} 
        className="form-control mb-2" 
        required 
      />
      <input 
        type="text" 
        placeholder="Malli" 
        value={model} 
        onChange={(e) => setModel(e.target.value)} 
        className="form-control mb-2" 
        required 
      />
      <input 
        type="number" 
        placeholder="Vuosimalli" 
        value={year} 
        onChange={(e) => setYear(e.target.value)} 
        className="form-control mb-2" 
        required 
      />
      <input 
        type="number" 
        placeholder="Kilometrit" 
        value={kilometers} 
        onChange={(e) => setKilometers(e.target.value)} 
        className="form-control mb-2" 
        required 
      />
      <input 
        type="number" 
        placeholder="Hinta (€)" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        className="form-control mb-2" 
        required 
      />

      <button onClick={handleUpdate} className={`${buttonClass} me-2`}>Päivitä</button>
      <button onClick={handleDelete} className="btn btn-danger">Poista myynnistä</button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default UpdateCar;
