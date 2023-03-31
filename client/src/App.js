import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./commons/Navbar";
import SignUp from "./pages/SignUp/Index";
import LogIn from "./pages/LogIn/Index";
import Inquiry from "./pages/Inquiry/Index";

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
              <Route path="/login" element={<LogIn />} />
              <Route path="/inquiry" element={<Inquiry/>} />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
};

export default App;
