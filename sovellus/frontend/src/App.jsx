import CreateUser from "./components/CreateUser.jsx";
import UpdateUser from "./components/UpdateUser.jsx";
import ReadDeleteUsers from "./components/ReadDeleteUsers.jsx";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
      <h1 className="text-center mb-4 text-dark fw-bold">User Management</h1>
      <div className="w-75">
        <div className="card p-4 shadow-sm mb-4 bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #007bff" }}>
          <h2 className="text-center text-primary">Create User</h2>
          <CreateUser onUserAdded={() => setRefresh(prev => prev + 1)} buttonClass="btn btn-primary w-100 mt-3" />
        </div>
        <div className="card p-4 shadow-sm mb-4 bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #dc3545" }}>
          <h2 className="text-center text-danger">Users List</h2>
          <ReadDeleteUsers refresh={refresh} buttonClass="btn btn-danger w-100 mt-2" />
        </div>
        <div className="card p-4 shadow-sm bg-white border-0 rounded-3" style={{ borderLeft: "5px solid #ffc107" }}>
          <h2 className="text-center text-warning">Update User</h2>
          <UpdateUser onUserUpdated={() => setRefresh(prev => prev + 1)} buttonClass="btn btn-warning w-100 mt-3" />
        </div>
      </div>
    </div>
  );
}

export default App;