import { useState } from "react";

function CreateCar({ onCarAdded, buttonClass }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [sellerId, setSellerId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5173/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, model, year, price, sellerId }),
    });

    if (response.ok) {
      onCarAdded();
      setBrand("");
      setModel("");
      setYear("");
      setPrice("");
      setSellerId("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="form-control mb-2" required />
      <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="Price (€)" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control mb-2" required />
      <input type="number" placeholder="Seller ID" value={sellerId} onChange={(e) => setSellerId(e.target.value)} className="form-control mb-2" required />
      <button type="submit" className={buttonClass}>Add Car</button>
    </form>
  );
}

export default CreateCar;
