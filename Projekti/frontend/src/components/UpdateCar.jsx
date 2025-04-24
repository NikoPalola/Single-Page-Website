// Tuodaan tarvittavat hookit ja kirjastot
import { useState, useEffect } from "react";
import axios from "axios";
import '../index.css';

// Komponentti, joka mahdollistaa auton tietojen päivittämisen tai poistamisen
function UpdateCar({ onCarUpdated, buttonClass }) {
  // Tilamuuttujat: token, autojen lista, valittu auto ja viestit
  const [token, setToken] = useState(null);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [message, setMessage] = useState("");

  // Haetaan token localStoragesta, kun komponentti renderöityy
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token: ", storedToken);
    setToken(storedToken);
  }, []);

  // Funktio, joka hakee käyttäjän autot palvelimelta
  const fetchUserCars = async () => {
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:3000/cars/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCars(response.data);
    } catch (error) {
      console.error("AxiosError", error);
      setMessage("Virhe haettaessa autoja.");
    }
  };

  // Kun token on saatu, haetaan autot
  useEffect(() => {
    fetchUserCars();
  }, [token]);

  // Käyttäjän valitsema auto tallennetaan tilaan
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setMessage(""); // Tyhjennetään mahdollinen virheilmoitus
  };

  // Päivitetään valitun auton tiedot palvelimelle
  const handleUpdate = async () => {
    if (!selectedCar) {
      setMessage("Valitse auto ensin.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/cars/${selectedCar.id}`, selectedCar, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      setMessage("Auton tiedot päivitetty!");
      onCarUpdated(response.data); // Ilmoitetaan parent-komponentille päivityksestä
    } catch (error) {
      setMessage(error.response?.data?.error || "Päivitys epäonnistui.");
      console.error(error);
    }
  };

  // Poistetaan auto palvelimelta
  const handleDelete = async () => {
    if (!selectedCar) {
      setMessage("Valitse auto ensin.");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/cars/${selectedCar.id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      setMessage("Auto poistettu myynnistä!");
      setSelectedCar(null); // Tyhjennetään valinta
      fetchUserCars(); // Haetaan autot uudelleen, jotta lista päivittyy
    } catch (error) {
      setMessage(error.response?.data?.error || "Poisto epäonnistui.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Päivitä tai poista oma auto</h2>
      
      {/* Auton valinta dropdown */}
      <select onChange={(e) => handleSelectCar(cars.find(car => car.id === Number(e.target.value)))} className="form-control mb-3">
        <option value="">Valitse auto</option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.brand} {car.model} ({car.year})
          </option>
        ))}
      </select>

      {/* Näytetään kentät, jos auto on valittu */}
      {selectedCar && (
        <div>
          <input
            type="text"
            value={selectedCar.brand}
            onChange={(e) => setSelectedCar({ ...selectedCar, brand: e.target.value })}
            className="form-control mb-2"
            required
          />
          <input
            type="text"
            value={selectedCar.model}
            onChange={(e) => setSelectedCar({ ...selectedCar, model: e.target.value })}
            className="form-control mb-2"
            required
          />
          <input
            type="number"
            value={selectedCar.year}
            onChange={(e) => setSelectedCar({ ...selectedCar, year: e.target.value })}
            className="form-control mb-2"
            required
          />
          <input
            type="number"
            value={selectedCar.kilometers}
            onChange={(e) => setSelectedCar({ ...selectedCar, kilometers: e.target.value })}
            className="form-control mb-2"
            required
          />
          <input
            type="number"
            value={selectedCar.price}
            onChange={(e) => setSelectedCar({ ...selectedCar, price: e.target.value })}
            className="form-control mb-2"
            required
          />

          {/* Toimintapainikkeet */}
          <button onClick={handleUpdate} className={`${buttonClass} me-2`}>Päivitä</button>
          <button onClick={handleDelete} className="btn btn-danger">Poista myynnistä</button>
        </div>
      )}

      {/* Viestit käyttäjälle */}
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default UpdateCar;
