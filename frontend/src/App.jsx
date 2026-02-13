import { Routes, Route, Link } from "react-router-dom";
import AddUsers from "./components/AddUsers";
import ListUsers from "./components/ListUsers";
import "./index.css";

function App() {
    return (
        <div className="container">
            {/* Navigation */}
            <nav className="nav">
                <Link to="/add-user">
                    <button className="add-user">Add User</button>
                </Link>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<ListUsers />} />
                <Route path="/add-user" element={<AddUsers />} />
            </Routes>
        </div>
    );
}

export default App;
