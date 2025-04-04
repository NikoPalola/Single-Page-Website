import { useEffect, useState } from "react";
import "../index.css"; // Tyyli tuodaan erikseen

function ReadDeleteCars({ refresh }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/cars")
      .then((res) => res.json())
      .then((data) => setCars(data));
  }, [refresh]);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/cars/${id}`, { method: "DELETE" });
    setCars(cars.filter((car) => car.id !== id));
  };

  return (
    <div className="cars-container">
      <h2>Myytävät autot</h2>
      <div className="cars-list">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <h3>{car.brand} {car.model} ({car.year})</h3>
            <p><strong>Hinta:</strong> {car.price} €</p>
            <p><strong>Kilometrit:</strong> {car.kilometers} km</p>
            <p><strong>Myynti ID:</strong> {car.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadDeleteCars;
