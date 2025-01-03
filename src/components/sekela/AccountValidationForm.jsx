import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentSavingForm from "./PaymentSavingForm"; // Import PaymentSavingForm
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import { GetCustomerDetail } from "../../services/sekelaServices";


const AccountValidationForm = ({ onSubmit, onClear }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountResponse, setAccountResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await GetCustomerDetail(accountNumber);
      console.log("Response:", response);

      if (response.data.status !== "200") {
        
        throw new Error(response.data.message || "Account validation failed.");
      }

      setAccountResponse(response.data);

      onSubmit(response.data.extraData);
      setError(null);
      setAccountNumber("");

    } catch (err) {
      console.error("Error Details: ", err);
      setError(err.message || "An error occurred while validating the account.");
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
    parseFloat(accountResponse.extraData?.AvailableBalance) > 0;

  return (
    <Box >
      {!accountResponse && (
        <Box component="form" onSubmit={handleAccountSubmit} noValidate>
          <TextField
            fullWidth
            variant="outlined"
            label="Account Number"
            placeholder="Enter Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            sx={{ marginBottom: "16px" }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "48%" }}
            >
              Validate Account
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              sx={{ width: "48%" }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ marginTop: "16px" }}>
          {error}
        </Alert>
      )}

      {accountResponse && (
        <Alert severity="success" sx={{ marginTop: "16px" }}>
          <AlertTitle>Account Details</AlertTitle>
          <Typography>Customer Name: {accountResponse.extraData["Customer Name"]}</Typography>
          <Typography>Account Number: {accountResponse.extraData["Account Number"]}</Typography>
          <Typography>Phone Number: {accountResponse.extraData["Phone Number"]}</Typography>
          <Typography>
            Available Balance: {accountResponse.extraData["AvailableBalance"]}
          </Typography>
        </Alert>
      )}

    </Box>
  );
};

export default AccountValidationForm;
