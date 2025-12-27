import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Posts from './components/Posts';

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#d42" }}>🧱 LEGO Flip Tracker</h1>
        <nav style={{ textAlign: "center", margin: "20px 0" }}>
          <Link to="/login" style={{ margin: "0 10px", textDecoration: "none", color: "#06c" }}>Login</Link> |
          <Link to="/register" style={{ margin: "0 10px", textDecoration: "none", color: "#06c" }}>Register</Link> |
          <Link to="/" style={{ margin: "0 10px", textDecoration: "none", color: "#06c" }}>All Flips</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Posts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
