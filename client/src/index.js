import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {UserContextProvider} from "./setup/context/UserContextProvider";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter>
       <UserContextProvider>
         <Routes>
           <Route path="/*" element={<App />} />
         </Routes>
       </UserContextProvider>
     </BrowserRouter>
  </React.StrictMode>
);