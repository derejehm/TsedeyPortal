import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import PaymentSavingForm from "./PaymentSavingForm"; // Import PaymentSavingForm

const AccountValidationForm = ({ billId, totalDue, accountName, onClear }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountResponse, setAccountResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        AccountID: "amhararbor11",
        Amount: "0",
        ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
      },
      InfoFields: {
        InfoField1: billId,
        InfoField7: accountNumber, // Pass account number here
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

      setAccountResponse(response.data);
      setError(null);
      setAccountNumber(""); // Clear input field after submission
    } catch (err) {
      console.error("Error Details: ", err);
      setError("An error occurred while validating the account number.");
      setAccountResponse(null);
    } finally {
      setLoading(false);
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
    parseFloat(accountResponse.extraData?.["AvailableBalance"]) > 5 &&
    totalDue > 0 &&
    totalDue < parseFloat(accountResponse.extraData?.["AvailableBalance"]);

  const availableBalance =
    parseFloat(accountResponse?.extraData?.["AvailableBalance"]) || 0;

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "20px auto" }}>
      {!accountResponse && (
        <form onSubmit={handleAccountSubmit}>
          <Box display="flex" flexDirection="column" gap={2} alignItems="center">
            <Typography variant="h6">Enter Account Number</Typography>
            <TextField
              label="Account Number"
              variant="outlined"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              fullWidth
              required
            />
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Validate Account"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </form>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {accountResponse && (
        <Box mt={3}>
          <Typography variant="h6">Account Details</Typography>
          <Typography>
            <strong>Customer Name:</strong>{" "}
            {accountResponse.extraData["Customer Name"]}
          </Typography>
          <Typography>
            <strong>Account Number:</strong>{" "}
            {accountResponse.extraData["Account Number"]}
          </Typography>
          <Typography>
            <strong>Phone Number:</strong>{" "}
            {accountResponse.extraData["Phone Number"]}
          </Typography>
          <Typography>
            <strong>Available Balance:</strong> {availableBalance.toFixed(2)}
            {totalDue >= availableBalance ? (
              <Typography color="error" component="span">
                {" "}
                - Insufficient Balance
              </Typography>
            ) : null}
          </Typography>
        </Box>
      )}
      {canShowPaymentSavingForm && (
        <PaymentSavingForm
          accountDetails={{
            billId: billId,
            phoneNumber: accountResponse.extraData["Phone Number"],
            customerName: accountResponse.extraData["Customer Name"],
            clientName: accountName,
            accountNumber: accountResponse.extraData["Account Number"],
          }}
          totalDue={totalDue}
          onClear={handleClear}
        />
      )}
    </Paper>
  );
};

export default AccountValidationForm;
