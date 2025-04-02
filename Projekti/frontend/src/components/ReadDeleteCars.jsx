import { useEffect, useState } from "react";

function ReadDeleteCars({ refresh, buttonClass }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5173/cars")
      .then((res) => res.json())
      .then((data) => setCars(data));
  }, [refresh]);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5173/cars/${id}`, { method: "DELETE" });
    setCars(cars.filter(car => car.id !== id));
  };

  return (
    <div>
      {cars.map(car => (
        <div key={car.id} className="d-flex justify-content-between align-items-center border p-2 mb-2">
          <span>{car.brand} {car.model} ({car.year}) - {car.price}€</span>
          <button onClick={() => handleDelete(car.id)} className={buttonClass}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ReadDeleteCars;
