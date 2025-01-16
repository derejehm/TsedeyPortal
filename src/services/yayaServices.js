import apiClient from "../utils/api-client";
// import apiClient from "./apiClient";

// Function to retrieve pending bill details
export async function GetPendingBill({ billId, accountId }) {
    const requestBody = {
        CustomerID: "1648094426",
        Country: "ETHIOPIATEST",
        BankID: "02",
        UniqueID: "aba47c60-e606-11ee-b720-f51215b66fxx",
        FunctionName: "GETNAME",
        ISOFieldsRequest: null,
        ISOFieldsResponse: null,
        PaymentDetails: {
            MerchantID: "YAYAPAYMENT",
            FunctionName: "GETNAME",
            AccountID: accountId,
            Amount: "0",
            ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
        },
        InfoFields: {
            InfoField1: billId,
            InfoField2: null,
            InfoField3: null,
        },
        MerchantConfig: {
            DLLCallID: "YAYAPAYMENT",
            MerchantCode: "YAYAPAYMENT",
            MerchantName: "YAYAPAYMENT",
            TrxAuthontication: null,
            MerchantProvider: "YAYA",
            MerchantURL: "https://localhost:44396/api/dynamic/Validate",
            MerchantReference: "{DATE}{STAN}",
        },
        ISOResponseFields: null,
        ResponseDetail: null,
        Customerdetail: {
            CustomerID: "1648094426",
            Country: "ETHIOPIATEST",
            MobileNumber: "251905557471",
            EmailID: "jack.njama@craftsilicon.com",
            FirstName: "Jack",
            LastName: "Njama",
        },
        ISORequest: null,
        ResponseFields: null,
        AppDetail: {
            AppName: "TSEDEY",
            Version: "1.8.17",
            CodeBase: "ANDROID",
            LATLON: "-1.2647891,36.7632677",
            TrxSource: "APP",
            DeviceNotificationID: "",
            DeviceIMEI: "148e122c64a564f2",
            DeviceIMSI: "148e122c64a564f2",
            ConnString: "",
        },
    };


    const response = await apiClient.post("/YAYA/GetPendingBill", requestBody, {
        headers: { "Content-Type": "application/json" },
    });
    return { ...response.data, requestBody };

}

// Function to retrieve customer details
export async function GetCustomerDetail({ billId, accountNumber }) {
    const requestBody = {
        CustomerID: "1648094426",
        Country: "ETHIOPIATEST",
        BankID: "02",
        UniqueID: "aba47c60-e606-11ee-b720-f51215b66fxx",
        FunctionName: "GETNAME",
        ISOFieldsRequest: null,
        ISOFieldsResponse: null,
        PaymentDetails: {
            MerchantID: "YAYAPAYMENT",
            FunctionName: "GETNAME",
            AccountID: accountNumber,
            Amount: "0",
            ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
        },
        InfoFields: {
            InfoField1: billId,
            InfoField7: accountNumber,
        },
        MerchantConfig: {
            DLLCallID: "YAYAPAYMENT",
            MerchantCode: "YAYAPAYMENT",
            MerchantName: "YAYAPAYMENT",
            TrxAuthontication: null,
            MerchantProvider: "YAYA",
            MerchantURL: "https://localhost:44396/api/dynamic/Validate",
            MerchantReference: "{DATE}{STAN}",
        },
        ISOResponseFields: null,
        ResponseDetail: null,
        Customerdetail: {
            CustomerID: "1648094426",
            Country: "ETHIOPIATEST",
            MobileNumber: "251905557471",
            EmailID: "jack.njama@craftsilicon.com",
            FirstName: "Jack",
            LastName: "Njama",
        },
        ISORequest: null,
        ResponseFields: null,
        AppDetail: {
            AppName: "TSEDEY",
            Version: "1.8.17",
            CodeBase: "ANDROID",
            LATLON: "-1.2647891,36.7632677",
            TrxSource: "APP",
            DeviceNotificationID: "",
            DeviceIMEI: "148e122c64a564f2",
            DeviceIMSI: "148e122c64a564f2",
            ConnString: "",
        },
    };


    const response = await apiClient.post("/YAYA/GetCustomerDetail", requestBody, {
        headers: { "Content-Type": "application/json" },
    });
    return { ...response.data, requestBody };


}



// Function to save payment details
export async function SavePaymentDetail(requestPayload) {

    const response = await apiClient.post("/Portals/SavePaymentDetail", requestPayload, {
        headers: { "Content-Type": "application/json" },
    });

    return { ...response.data, requestPayload };

}