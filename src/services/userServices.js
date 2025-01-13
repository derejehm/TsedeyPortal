import { redirect } from "react-router-dom";
import apiClient from "../utils/api-client";
import { DataUsageRounded } from "@mui/icons-material";

const tokenName = "session";

export function getSessionDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export async function login(user) {
    const { data } = await apiClient.post("Portals/AuthenticateUser", user);
    
    if (data.status === "200") {
        localStorage.setItem(tokenName, data.session);
        localStorage.setItem('username', user.User_ID);        
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
    }
    return data;
}

export async function getUserDetails() {

   
   const userRequest= {
        "OperatorID" : localStorage.getItem('username')
    }
    const { data } = await apiClient.post("/Portal/GetUser", userRequest);
    
    return data;
}



export function logout() {
    localStorage.removeItem(tokenName);
    localStorage.removeItem('expiration');
    localStorage.removeItem('username');
    return redirect('/login')
}

export function getUser() {
    try {
        const session = localStorage.getItem(tokenName);
        return session;
    } catch (error) {
        return null;
    }
}

export function getSession() {
    const session = localStorage.getItem(tokenName);

    if (!session) {
        return null;
    }

    const sessionDuration = getSessionDuration();
    if (sessionDuration < 0) {
        return 'EXPIRED'
    }
    return session
}

export function checkAuthLoader() {
    const session = getSession();

    if (!session) {
        return redirect("/login");
    }

}