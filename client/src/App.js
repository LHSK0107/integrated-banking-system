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
import LogHistory from "./pages/Admin/component/LogHistory";
import ClickHistory from "./pages/Admin/component/ClickHistory";
import {UserContextProvider} from "./setup/context/UserContextProvider";
import ApproveAuth from "./commons/ApproveAuth";
import { MenuContextProvider } from "./setup/context/MenuContextProvider";

const App = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <UserContextProvider>
      <div className="App">
        <div className="container">
          <QueryClientProvider client={client}>
            <Router>
              <MenuContextProvider>
                <Navbar />
              </MenuContextProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />

                {/* 로그인 필요 */}
                <Route element={<ApproveAuth />}>
                  <Route path="/logout" element={<LogOut />} />
                </Route>
                <Route element={<ApproveAuth />}>
                  <Route path="/dashboard" element={<DashBoard />} />
                </Route>
                <Route element={<ApproveAuth />}>
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
                <Route path="/logHistory" element={<LogHistory />} />
                <Route path="/clickHistory" element={<ClickHistory />} />
                {/* 404페이지 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </Router>
          </QueryClientProvider>
        </div>
      </div>
    </UserContextProvider>
  );
};

export default App;
