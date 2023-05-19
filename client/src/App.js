import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./commons/Navbar";
import SignUp from "./pages/SignUp/Index";
import LogIn from "./pages/LogIn/Index";
import Inquiry from "./pages/Inquiry/Index";
import NotFound from "./pages/404/Index";
import Index from "./pages/Index/Index";
import DashBoard from "./pages/Dashboard/Index";
import Mypage from "./pages/Mypage/Index";
import InOut from "./pages/InOut/Index";
import Admin from "./pages/Admin/Index";
import AdminDetail from "./pages/Admin/component/Detail.js";
import Footer from "./commons/Footer";
import DailyReport from "./pages/DailyReport/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LogHistory from "./pages/Admin/component/LogHistory";
import ClickHistory from "./pages/Admin/component/ClickHistory";
import ApproveAuth from "./commons/ApproveAuth";
import { MenuContextProvider } from "./setup/context/MenuContextProvider";
import useAuth from "./hooks/useAuth";
import decodeJwt from "./utils/decodeJwt";
const App = () => {
  const {setToken2,setLoggedUserInfo} = useAuth();
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  useEffect(()=>{
    if(localStorage.getItem("jwt")){
      setToken2(localStorage.getItem("jwt"));
      const decodedPayload = decodeJwt(localStorage.getItem("jwt"));
      setLoggedUserInfo({
        id: decodedPayload.sub,
        name: decodedPayload.name,
        exp: decodedPayload.exp,
        userCode: decodedPayload.userCode,
        userNo: decodedPayload.userNo,
      });
    }
  },[]);
  return (
    <div className="App">
      <div className="container">
        <QueryClientProvider client={client}>
          <MenuContextProvider>
            <Navbar />
          </MenuContextProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route element={<ApproveAuth />}>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/dailyReport" element={<DailyReport />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="inout">
                <Route index element={<InOut />} />
                <Route path=":bankCD/:acctNo" element={<InOut />} />
              </Route>
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/admin">
                <Route index element={<Admin />} />
                <Route path=":userNo" element={<AdminDetail />} />
              </Route>
              <Route path="/logHistory" element={<LogHistory />} />
              <Route path="/clickHistory" element={<ClickHistory />} />
            </Route>
            {/* 404페이지 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default App;
