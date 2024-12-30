import  { useEffect } from "react";
import { logout } from "../services/userServices";

const Logout = () => {

    useEffect(() => {
        //logout();
        localStorage.removeItem( "session");
        window.location = "/";
    }, []);

    return null;
}

export default Logout;