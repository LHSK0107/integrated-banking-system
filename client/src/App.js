import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./commons/Navbar";
import SignUp from "./pages/SignUp/Index";
import LogIn from "./pages/LogIn/Index";
import Inquiry from "./pages/Inquiry/Index";
import NotFound from "./pages/404/Index";
import Index from "./pages/Index/Index";

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<><Index/></>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/inquiry" element={<Inquiry/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
