import { useState } from "react";
import '../index.css';

function UpdateCar({ onCarUpdated, buttonClass }) {
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");

  const handleUpdate = async () => {
    await fetch(`http://localhost:5173/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    onCarUpdated();
  };

  return (
    <div>
      <input type="number" placeholder="Myynti ID" value={id} onChange={(e) => setId(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="Merkki" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="Malli" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="Vuosimalli" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="Hinta (€)" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control mb-2" required />
      <button onClick={handleUpdate} className={buttonClass}>Päivitä</button>
    </div>
  );
}

export default UpdateCar;
