import apiClient from "../utils/api-client";

export async function penddingPayments(requestBody) {
    const  response = await apiClient.post("Portals/AccessConsolidatedPendingPayment",requestBody);
    console.log("Response" , response.data);

    return {...response.data};
}