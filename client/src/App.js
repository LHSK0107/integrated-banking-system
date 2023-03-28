import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./commons/Navbar";
const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="inner">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<></>} />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;