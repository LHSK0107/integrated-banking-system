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
import LogOut from "./pages/LogIn/LogOut";
import Mypage from "./pages/Mypage/Index";
import Admin from "./pages/Admin/Index";
import AdminDetail from "./pages/Admin/component/Detail.js";
import Footer from "./commons/Footer";
import DailyReport from "./pages/DailyReport/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogInContext } from "./commons/LogInContext";
import { useState } from "react";
import {UserContextProvider} from "./setup/context/UserContextProvider";
import ApproveAuth from "./commons/ApproveAuth";
const App = () => {
  const [token, setToken] = useState(null);
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
      value={{ token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn }}
    >
      <UserContextProvider>

      <div className="App">
        <div className="container">
          <QueryClientProvider client={client}>
              <Router>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<LogIn />} />

                  {/* 로그인 필요 */}
                  <Route element={<ApproveAuth/>}>
                    <Route path="/logout" element={<LogOut />} />
                  </Route>
                  <Route element={<ApproveAuth/>}>
                   <Route path="/dashboard" element={<DashBoard />} />
                  </Route>
                  <Route element={<ApproveAuth/>}>
                    <Route path="inquiry">
                      <Route index element={<Inquiry />} />
                      <Route path=":acctNo" element={<DetailInquiry />} />
                    </Route>
                  </Route>
                  <Route path="/inout" element={<InOut />} />
                  <Route path="/dailyReport" element={<DailyReport />} />
                  <Route path="/mypage" element={<Mypage />} />
                  <Route path="/admin">
                    <Route index element={<Admin />} />
                    <Route path=":userNo" element={<AdminDetail />} />
                  </Route>

                  {/* 404페이지 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </Router>
          </QueryClientProvider>
        </div>
      </div>
      </UserContextProvider>
    </LogInContext.Provider>
  );
};

export default App;
