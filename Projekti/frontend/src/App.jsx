import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateUser from "./components/CreateUser.jsx";
import UpdateUser from "./components/UpdateUser.jsx";
import ReadDeleteUsers from "./components/ReadDeleteUsers.jsx";
import CreateCar from "./components/CreateCar.jsx";
import ReadDeleteCars from "./components/ReadDeleteCars.jsx";
import UpdateCar from "./components/UpdateCar.jsx";
import { useState } from "react";
import './index.css';

function App() {
  const [refreshUsers, setRefreshUsers] = useState(0);
  const [refreshCars, setRefreshCars] = useState(0);

  return (
    
     <Router>
      <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
        <h1 className="text-center mb-4 text-dark fw-bold">Auto osto ja myynti</h1>
        <div className="w-75">
          {/* Navigaatio */}
          <nav className="mb-4">
            <ul className="nav justify-content-center">
              <li className="nav-item">
                <Link className="nav-link" to="/create-user">Luo käyttäjä</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/update-user">Päivitä käyttäjä</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create-car">Myy autosi</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cars">Myytävänä olevat autot</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/update-car">Muokkaa autosi</Link>
              </li>
            </ul>
          </nav>

          {/* Reititykset */}
          <Routes>
            <Route path="/create-user" element={<CreateUser onUserAdded={() => setRefreshUsers(prev => prev + 1)} buttonClass="btn btn-primary w-100 mt-3" />} />
            <Route path="/update-user" element={<UpdateUser onUserUpdated={() => setRefreshUsers(prev => prev + 1)} buttonClass="btn btn-warning w-100 mt-3" />} />
            <Route path="/create-car" element={<CreateCar onCarAdded={() => setRefreshCars(prev => prev + 1)} buttonClass="btn btn-success w-100 mt-3" />} />
            <Route path="/cars" element={<ReadDeleteCars refresh={refreshCars} buttonClass="btn btn-info w-100 mt-2" />} />
            <Route path="/update-car" element={<UpdateCar onCarUpdated={() => setRefreshCars(prev => prev + 1)} buttonClass="btn btn-purple w-100 mt-3" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
      