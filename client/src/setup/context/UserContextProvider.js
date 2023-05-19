import React, {createContext, useState} from 'react';

const UserContext = createContext(null);

export const UserContextProvider = ({children}) => {
    const [token, setToken2] = useState(null);
    const [loggedUserInfo, setLoggedUserInfo] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const value = {
        token,
        setToken2,
        loggedUserInfo,
        setLoggedUserInfo,
        isAuth,
        setIsAuth
    }
    return (
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
}

export default UserContext;