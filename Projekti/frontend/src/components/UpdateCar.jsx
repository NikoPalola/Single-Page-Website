import { useState } from "react";

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
      <input type="number" placeholder="Car ID" value={id} onChange={(e) => setId(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="New Price (€)" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control mb-2" required />
      <button onClick={handleUpdate} className={buttonClass}>Update</button>
    </div>
  );
}

export default UpdateCar;
