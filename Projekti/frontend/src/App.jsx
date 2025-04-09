import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useState } from "react";
import CreateUser from "./components/CreateUser.jsx";
import UpdateUser from "./components/UpdateUser.jsx";
import ReadDeleteUsers from "./components/ReadDeleteUsers.jsx";
import CreateCar from "./components/CreateCar.jsx";
import ReadCars from "./components/ReadCars.jsx";
import UpdateCar from "./components/UpdateCar.jsx";
import Login from './components/Login.jsx';

import './index.css';

function App() {
  const [refreshUsers, setRefreshUsers] = useState(0);
  const [refreshCars, setRefreshCars] = useState(0);

  const handleUserAdded = () => setRefreshUsers(prev => prev + 1);
  const handleUserUpdated = () => setRefreshUsers(prev => prev + 1);
  const handleCarAdded = () => setRefreshCars(prev => prev + 1);
  const handleCarUpdated = () => setRefreshCars(prev => prev + 1);

  return (
    <Router>
      <div className="container py-4">

        <h1 className="text-center mb-4 text-dark fw-bold">Auto osto ja myynti</h1>

        {/* Navigaatio */}
        <nav className="mb-4 d-flex justify-content-center gap-3 bg-dark p-3 rounded">
          <Link className="nav-link text-light" to="/cars">Myytävänä olevat autot</Link>
          <Link className="nav-link text-light" to="/create-car">Myy autosi</Link>
          <Link className="nav-link text-light" to="/update-car">Muokkaa myynti-ilmoitusta</Link>
          <Link className="nav-link text-light" to="/update-user">Päivitä käyttäjä</Link>
          <Link className="nav-link text-light" to="/login">Kirjaudu</Link>
        </nav>

        {/* Reitit */}
        <Routes>
          <Route path="/" element={<Navigate to="/cars" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-user" element={<CreateUser onUserAdded={handleUserAdded} buttonClass="btn btn-primary w-100 mt-3" />} />
          <Route path="/update-user" element={<UpdateUser onUserUpdated={handleUserUpdated} buttonClass="btn btn-warning w-100 mt-3" />} />
          <Route path="/create-car" element={<CreateCar onCarAdded={handleCarAdded} buttonClass="btn btn-success w-100 mt-3" />} />
          <Route path="/cars" element={<ReadCars refresh={refreshCars} />} />
          <Route path="/update-car" element={<UpdateCar onCarUpdated={handleCarUpdated} buttonClass="btn btn-secondary w-100 mt-3" />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
