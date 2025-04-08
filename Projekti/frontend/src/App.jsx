import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateUser from "./components/CreateUser.jsx";
import UpdateUser from "./components/UpdateUser.jsx";
import ReadDeleteUsers from "./components/ReadDeleteUsers.jsx";
import CreateCar from "./components/CreateCar.jsx";
import ReadDeleteCars from "./components/ReadDeleteCars.jsx";
import UpdateCar from "./components/UpdateCar.jsx";
import { useState } from "react";
import './index.css';
import { Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';


function App() {
  const [refreshUsers, setRefreshUsers] = useState(0);
  const [refreshCars, setRefreshCars] = useState(0);

  return (

    <Router>
      
        <h1 className="text-center mb-4 text-dark fw-bold">Auto osto ja myynti</h1>
   
          {/* Navigaatio */}
          <nav className="mb-4 d-flex justify-content-center gap-3">
          <Link className="nav-link text-light" to="/cars">Myytävänä olevat autot</Link>
          <Link className="nav-link text-light" to="/create-car">Myy autosi</Link>
           <Link className="nav-link text-light" to="/update-car">Muokkaa myynti-ilmoitustasi</Link>
           <Link className="nav-link text-light" to="/update-user">Päivitä käyttäjä</Link>
           <Link className="nav-link text-light" to="/login">Kirjaudu</Link>
          </nav>

          {/* Reititykset */}
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/cars" />} />
            <Route path="/create-user" element={<CreateUser onUserAdded={() => setRefreshUsers(prev => prev + 1)} buttonClass="btn btn-primary w-100 mt-3" />} />
            <Route path="/update-user" element={<UpdateUser onUserUpdated={() => setRefreshUsers(prev => prev + 1)} buttonClass="btn btn-warning w-100 mt-3" />} />
            <Route path="/create-car" element={<CreateCar onCarAdded={() => setRefreshCars(prev => prev + 1)} buttonClass="btn btn-success w-100 mt-3" />} />
            <Route path="/cars" element={<ReadDeleteCars refresh={refreshCars} buttonClass="btn btn-info w-100 mt-2" />} />
            <Route path="/update-car" element={<UpdateCar onCarUpdated={() => setRefreshCars(prev => prev + 1)} buttonClass="btn btn-secondary w-100 mt-3" />} />
          </Routes>
        
    </Router>
  );
}

export default App;
