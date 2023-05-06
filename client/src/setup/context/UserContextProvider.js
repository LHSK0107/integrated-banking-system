import React, {createContext, useState} from 'react';

export const UserContext = createContext(null);

export const UserContextProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [loggedUserInfo, setLoggedUserInfo] = useState({
      id: "",
      name: "",
      exp: "",
      userCode: "",
      userNo: "",
    });
    const [isAuth, setIsAuth] = useState(false);
    const value = {
        token,
        setToken,
        loggedUserInfo,
        setLoggedUserInfo,
        isAuth,
        setIsAuth
    }
    return (
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
}