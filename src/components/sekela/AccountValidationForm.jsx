import React, { useState } from "react";
import axios from "axios";
import PaymentSavingForm from "./PaymentSavingForm"; // Import PaymentSavingForm
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  Divider,
} from "@mui/material";

const AccountValidationForm = ({
  studentId,
  totalOutstandingFee,
  studentFullName,
  transactionId,
  months,
  amounts,
  grade,
  school,
  onClear,
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountResponse, setAccountResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

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
        InfoField1: "",
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

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/YAYA/GetCustomerDetail",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

 
      if(response.data.message ==="Success"){
        setAccountResponse(response.data);
        setAccountNumber("");
        setError(null);

      }else{
        setError(response.data.message);

      }

      
      
     
    } catch (err) {
      console.error("Error Details: ", err);
      setError("An error occurred while validating the account number.");
      setAccountResponse(null);
    }
  };

  const handleClear = () => {
    setAccountNumber("");
    setAccountResponse(null);
    setError(null);
    onClear(); // Call clear function passed from parent
  };

  const canShowPaymentSavingForm =
    accountResponse &&
    accountResponse.status === "200" &&
    parseFloat(accountResponse.extraData?.AvailableBalance) > 0 &&
    totalOutstandingFee > 0 &&
    totalOutstandingFee <
      parseFloat(accountResponse.extraData?.["AvailableBalance"]);

  const availableBalance =
    parseFloat(accountResponse?.extraData?.["AvailableBalance"]) || 0;

   
  return (
    <Box sx={{ p: 3 }}>
      {(accountResponse && accountResponse.status ==="200")   ? null : (
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <form onSubmit={handleAccountSubmit}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Please Enter The Account Number:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Number"
                  variant="outlined"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Validate
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {(accountResponse && accountResponse.status ==="200") && (
      
        <Box mt={3} p={2} border="1px solid" borderColor="grey.300" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
        Account Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1">
          <strong> Customer Name: </strong> {accountResponse.extraData["Customer Name"]}
        </Typography>
        <Typography variant="body1">
          <strong>Account Number: </strong> {accountResponse.extraData["Account Number"]}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number: </strong>{accountResponse.extraData["Phone Number"]}
        </Typography>
        <Typography variant="body1">
            <strong>Available Balance:</strong> {availableBalance.toFixed(2)}
             {totalOutstandingFee >= availableBalance ? (
              <span style={{ color: "red", fontStyle: "italic" }}>
               {" - Insufficient Balance"}
               </span>
            ) : null}
          </Typography>
      </Box>
      )}

      {canShowPaymentSavingForm && (
        <PaymentSavingForm
          paymentDetails={{
            studentId,
            totalOutstandingFee,
            accountNumber: accountResponse.extraData["Account Number"],
            customerName: accountResponse.extraData["Customer Name"],
            studentFullName,
            phoneNumber: accountResponse.extraData["Phone Number"],
            transactionId,
            months,
            amounts,
            grade,
            school,
          }}
          onClear={handleClear}
        />
      )}
    </Box>
  );
};

export default AccountValidationForm;
