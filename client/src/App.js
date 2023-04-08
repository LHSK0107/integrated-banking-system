import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./commons/Navbar";
import SignUp from "./pages/SignUp/Index";
import LogIn from "./pages/LogIn/Index";
import Inquiry from "./pages/Inquiry/Index";
import NotFound from "./pages/404/Index";
import Index from "./pages/Index/Index";
import DetailInquiry from "./pages/DetailInquiry/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const client=new QueryClient({defaultOptions:{
    queries:{
      refetchOnWindowFocus: false
    }
  }})
  return (
    <div className="App">
      <div className="container">
      <QueryClientProvider client={client}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="inquiry">
              <Route index element={<Inquiry/>} />
                <Route path=":acctNo" element={<DetailInquiry />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default App;
