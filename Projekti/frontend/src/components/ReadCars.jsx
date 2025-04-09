import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

function ReadOnlyCars({ refresh }) {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");  // Virheilmoitus

  useEffect(() => {
    // Axiosilla tehdään GET-pyyntö palvelimelle ilman autentikointia
    axios
      .get("http://localhost:3000/cars")  // Hae kaikki autot ilman autentikointia
      .then((response) => {
        setCars(response.data);  // Tallennetaan autot tilaan
      })
      .catch((err) => {
        setMessage("Virhe ladattaessa autoja: " + (err.response ? err.response.data.error : err.message));
        console.error("Virhe:", err);
      });
  }, [refresh]);

  return (
    <div className="cars-container">
      <h2>Myytävät autot</h2>
      {message && <p>{message}</p>}  {/* Näytetään virheilmoitukset */}
      <div className="cars-list">
        {cars.length === 0 && <p>Ei autoja myynnissä.</p>}
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <h3>{car.brand} {car.model} ({car.year})</h3>
            <p><strong>Hinta:</strong> {car.price} €</p>
            <p><strong>Kilometrit:</strong> {car.kilometers} km</p>
            <p><strong>Myyjä:</strong> {car.User?.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadOnlyCars;
