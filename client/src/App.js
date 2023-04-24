import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./commons/Navbar";
import SignUp from "./pages/SignUp/Index";
import LogIn from "./pages/LogIn/Index";
import Inquiry from "./pages/Inquiry/Index";
import NotFound from "./pages/404/Index";
import Index from "./pages/Index/Index";
import DetailInquiry from "./pages/DetailInquiry/Index";
import DashBoard from "./pages/Dashboard/Index";
import InOut from "./pages/InOut/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./commons/Footer";
import { LogInContext } from "./commons/LogInContext";
import { useState } from "react";

const App = () => {
  const [loggedUser, setLoggedUser] = useState({
    id: "",
    name: "",
    exp: "",
    userCode: "",
    userNo: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <LogInContext.Provider
      value={{ loggedUser, setLoggedUser, loggedIn, setLoggedIn }}
    >
      <div className="App">
        <div className="container">
          <QueryClientProvider client={client}>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="inquiry">
                  <Route index element={<Inquiry />} />
                  <Route path=":acctNo" element={<DetailInquiry />} />
                </Route>
                <Route path="/inout" element={<InOut />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </Router>
          </QueryClientProvider>
        </div>
      </div>
    </LogInContext.Provider>
  );
};

export default App;
