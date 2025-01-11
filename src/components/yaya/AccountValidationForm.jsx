import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import PaymentSavingForm from "./PaymentSavingForm"; // Import PaymentSavingForm
import { GetCustomerDetail } from "../../services/yayaServices";

const AccountValidationForm = ({ billId, totalDue, accountName, onClear }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountResponse, setAccountResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await GetCustomerDetail({ billId, accountNumber });      

        console.log("Response:", response);
      if (response.data.message !== "Success" ) {
        setError(response.data.message);
      }else{
        setAccountResponse(response.data);
        console.log("Response:", response);
        setError(null);
        setAccountNumber("");
      }

    
    // Clear input field after submission
    } catch (err) {
     console.log("Error Details: ", err); 
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
    parseFloat(accountResponse.extraData?.["AvailableBalance"]) > 5 &&
    totalDue > 0 &&
    totalDue < parseFloat(accountResponse.extraData?.["AvailableBalance"]);

  const availableBalance =
    parseFloat(accountResponse?.extraData?.["AvailableBalance"]) || 0;

 

  return (
    <Box mt={3} p={2}>
      {(!accountResponse || totalDue >= availableBalance ) ? ( // Hide the form if accountResponse is available
        <Box
          component="form"
          onSubmit={handleAccountSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.primary">
            Please Enter The Account Number:
          </Typography>

          <TextField
            label="Account Number"
            variant="outlined"
            fullWidth
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />

          <Box display="flex" gap={2}>
            <Button type="submit" variant="contained" color="primary">
              Validate Account
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>
        </Box>
      ) : null}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {accountResponse  && (
        <Box mt={3} p={2} border="1px solid" borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            Customer Details:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong>Customer Name:</strong> {accountResponse.extraData["Customer Name"]}
          </Typography>
          <Typography variant="body1">
            <strong>Account Number:</strong> {accountResponse.extraData["Account Number"]}
          </Typography>
          <Typography variant="body1">
            <strong>Phone Number:</strong> {accountResponse.extraData["Phone Number"]}
          </Typography>
          <Typography variant="body1" color={totalDue >= availableBalance ? "error.main" : "text.primary"}>
            <strong>Available Balance:</strong> {availableBalance.toFixed(2)}
            {totalDue >= availableBalance && (
              <>
              <Typography component="span" sx={{ fontStyle: "italic" }}>
                {" - Insufficient Balance"}
              </Typography>
              
              </>
            )}
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
    </Box>
  );
};

export default AccountValidationForm;
