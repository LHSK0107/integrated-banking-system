import { createContext, useContext } from "react";

export const LogInContext = createContext({
  token: null,
  loggedUser: {
    id: "",
    name: "",
    exp: "",
    userCode: "",
    userNo: "",
  },
  loggedIn: false
});
