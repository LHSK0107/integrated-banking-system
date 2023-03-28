import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./commons/Navbar";
import SignUp from "./pages/SignUp/Index";
const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="inner">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<></>} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
};

export default App;