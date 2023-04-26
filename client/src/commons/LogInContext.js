import { createContext, useContext } from "react";

export const LogInContext = createContext({
  loggedUser: {
    id: "",
    name: "",
    exp: "",
    userCode: "",
    userNo: "",
  },
  loggedIn: false
});
