import { useContext } from "react";
import UserContext from "../setup/context/UserContextProvider";

const useAuth = () => {
    return useContext(UserContext);
}

export default useAuth;