import apiClient from "../utils/api-client";

const tokenName = "session";
var timeoutId ="";


// export async function signup(user, profile) {
//     const body = new FormData();
//     body.append("name", user.name);
//     body.append("email", user.email);
//     body.append("password", user.password);
//     body.append("deliveryAddress", user.deliveryAddress);
//     body.append("profilePic", profile);

//     const { data } = await apiClient.post("/user/signup", body);
//     localStorage.setItem(tokenName, data.token);
// }

export async function login(user) {
    const { data } = await apiClient.post("Portals/AuthenticateUser", user);
    if (data.status === "200") {
        localStorage.setItem(tokenName, data.session);
        
    }

    const id = window.setTimeout(() => {
        logout();
      }, 300000);

      timeoutId=id; 

    return data;

}


export function logout() {
   
    localStorage.removeItem(tokenName);
    if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
    return localStorage.getItem(tokenName);
}