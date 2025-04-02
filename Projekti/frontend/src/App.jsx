import CreateUser from "./components/CreateUser.jsx";
import UpdateUser from "./components/UpdateUser.jsx";
import ReadDeleteUsers from "./components/ReadDeleteUsers.jsx";
import CreateCar from "./components/CreateCar.jsx";
import ReadDeleteCars from "./components/ReadDeleteCars.jsx";
import UpdateCar from "./components/UpdateCar.jsx";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [refreshUsers, setRefreshUsers] = useState(0);
  const [refreshCars, setRefreshCars] = useState(0);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
      <h1 className="text-center mb-4 text-dark fw-bold">Car Sales Platform</h1>
      <div className="w-75">
        {/* Käyttäjän luonti */}
        <div className="card p-4 shadow-sm mb-4 bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #007bff" }}>
          <h2 className="text-center text-primary">Create User</h2>
          <CreateUser onUserAdded={() => setRefreshUsers(prev => prev + 1)} buttonClass="btn btn-primary w-100 mt-3" />
        </div>

        {/* Käyttäjälista */}
        <div className="card p-4 shadow-sm mb-4 bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #dc3545" }}>
          <h2 className="text-center text-danger">Users List</h2>
          <ReadDeleteUsers refresh={refreshUsers} buttonClass="btn btn-danger w-100 mt-2" />
        </div>

        {/* Käyttäjän päivitys */}
        <div className="card p-4 shadow-sm mb-4 bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #ffc107" }}>
          <h2 className="text-center text-warning">Update User</h2>
          <UpdateUser onUserUpdated={() => setRefreshUsers(prev => prev + 1)} buttonClass="btn btn-warning w-100 mt-3" />
        </div>

        {/* Auton luonti */}
        <div className="card p-4 shadow-sm mb-4 bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #28a745" }}>
          <h2 className="text-center text-success">Create Car</h2>
          <CreateCar onCarAdded={() => setRefreshCars(prev => prev + 1)} buttonClass="btn btn-success w-100 mt-3" />
        </div>

        {/* Autolista */}
        <div className="card p-4 shadow-sm mb-4 bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #17a2b8" }}>
          <h2 className="text-center text-info">Cars List</h2>
          <ReadDeleteCars refresh={refreshCars} buttonClass="btn btn-info w-100 mt-2" />
        </div>

        {/* Auton päivitys */}
        <div className="card p-4 shadow-sm bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #6f42c1" }}>
          <h2 className="text-center text-purple">Update Car</h2>
          <UpdateCar onCarUpdated={() => setRefreshCars(prev => prev + 1)} buttonClass="btn btn-purple w-100 mt-3" />
        </div>
      </div>
    </div>
  );
}

export default App;
