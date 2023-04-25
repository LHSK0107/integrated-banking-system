import { useContext } from "react";
import decodeJwt from "./decodeJwt";
import { LogInContext } from "../commons/LogInContext";

const useDecodeJwt = (jwt) => {
  const { setLoggedUser, setLoggedIn } = useContext(LogInContext);
  const token = decodeJwt(jwt);
  setLoggedUser({
    id: token.id,
    name: token.name,
    exp: token.exp,
    userCode: token.userCode,
    userNo: token.userNo
  });
  setLoggedIn(true);
};

export default useDecodeJwt;
