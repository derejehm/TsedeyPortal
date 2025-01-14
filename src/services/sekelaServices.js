import apiClient from "../utils/api-client";

// export async function GetStudentFees(requestBody) {
//     const { data } = await apiClient.post("/Portals/GetStudentFees", requestBody,{ headers: { "Content-Type": "application/json" }});

//     return data;
// }

export async function GetStudentFees(requestBody) {
    const  response = await apiClient.post("/Portals/GetStudentFees", requestBody,{ headers: { "Content-Type": "application/json" }});
    return {...response.data ,requestBody};
}



export  async function SekelaSavePayment(requestPayload) {
    try {
        const response = await apiClient.post("/Portals/SekelaSavePayment", requestPayload, { headers: { "Content-Type": "application/json" } }
        );
        return response
    } catch (err) {
        console.error("Save Payment Error Details: ", err);
    }

    return "An error occurred while saving the payment details."
};


export  async function GetCustomerDetail(accountNumber) {

    const requestBody = {
          CustomerID: "1648094426",
          Country: "ETHIOPIATEST",
          BankID: "02",
          UniqueID: "aba47c60-e606-11ee-b720-f51215b66fxx",
          FunctionName: "GETNAME",
          PaymentDetails: {
            MerchantID: "YAYAPAYMENT",
            FunctionName: "GETNAME",
            AccountID: accountNumber,
            Amount: "0",
            ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
          },
          InfoFields: {
            InfoField7: accountNumber,
          },
          MerchantConfig: {
            MerchantCode: "YAYAPAYMENT",
            MerchantName: "YAYAPAYMENT",
          },
          Customerdetail: {
            CustomerID: "1648094426",
            Country: "ETHIOPIATEST",
            MobileNumber: "251905557471",
            EmailID: "jack.njama@craftsilicon.com",
          },
          AppDetail: {
            AppName: "TSEDEY",
            Version: "1.8.17",
          },
        };
    try {
        const response = await apiClient.post("/YAYA/GetCustomerDetail", requestBody, { headers: { "Content-Type": "application/json" } }
        );
        return response
    } catch (err) {
        console.error("Save Payment Error Details: ", err);
    }

    return "An error occurred while saving the payment details."
};

