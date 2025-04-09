import { useState, useEffect } from "react";
import axios from "axios";
import '../index.css';

function UpdateCar({ onCarUpdated, buttonClass }) {
  const [token, setToken] = useState(null);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token: ", storedToken);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUserCars = async () => {
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

    fetchUserCars();
  }, [token]);

  // Auton tietojen valinta
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setMessage(""); // Poista mahdollinen aikaisempi virheilmoitus
  };

  // Päivitä auto
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
      onCarUpdated(response.data); // Päivitä auto komponentissa
    } catch (error) {
      setMessage(error.response?.data?.error || "Päivitys epäonnistui.");
      console.error(error);
    }
  };

  // Poista auto
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
      setSelectedCar(null); // Tyhjennä valittu auto
      fetchUserCars(); // Päivitä lista
    } catch (error) {
      setMessage(error.response?.data?.error || "Poisto epäonnistui.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Päivitä tai poista oma auto</h2>
      
      <select onChange={(e) => handleSelectCar(cars.find(car => car.id === Number(e.target.value)))} className="form-control mb-3">
        <option value="">Valitse auto</option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.brand} {car.model} ({car.year})
          </option>
        ))}
      </select>

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

          <button onClick={handleUpdate} className={`${buttonClass} me-2`}>Päivitä</button>
          <button onClick={handleDelete} className="btn btn-danger">Poista myynnistä</button>
        </div>
      )}

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default UpdateCar;
