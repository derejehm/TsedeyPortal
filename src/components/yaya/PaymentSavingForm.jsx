import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { SavePaymentDetail } from "../../services/yayaServices";

const PaymentSavingForm = ({ accountDetails, totalDue, onClear }) => {
  const [narration, setNarration] = useState("");
  const [saveResponse, setSaveResponse] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [requestBody, setRequestBody] = useState({}); // Store request body for preview

  const handlePaymentSave = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toLocaleString();

    // Prepare the request payload
    const requestPayload = {
      Amount: totalDue,
      Client_yaya_account: "amhararbor11",
      Client_Name: accountDetails.clientName,
      Customer_Account: accountDetails.accountNumber,
      Customer_Name: accountDetails.customerName,
      Customer_Phone_Number: accountDetails.phoneNumber,
      Transfer_To: "1201160002517", // Static value
      Branch_ID: localStorage.getItem('branch'), // Static value
      CreatedOn: currentDate,
      CreatedBy: localStorage.getItem("username"), // Static value or dynamically set
      Bill_ID: accountDetails.billId,
      Narration: narration,
    };

    console.log("Request Payload Before Saving:", requestPayload); // Log the request payload
    setRequestBody(requestPayload); // Save to state for displaying

    try {
      const response = await SavePaymentDetail(requestPayload);
      setSaveResponse(response.data);
      setSaveError(null);
    } catch (err) {
      console.error("Save Payment Error Details: ", err);
      setSaveError("An error occurred while saving the payment details.");
      setSaveResponse(null);
    }
  };

  const handleClear = () => {
    setNarration("");
    setSaveResponse(null);
    setSaveError(null);
    onClear(); // Call clear function from parent
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
      {!saveResponse ? (
        <Box
          component="form"
          onSubmit={handlePaymentSave}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.primary">
            Enter Payment Narration
          </Typography>

          <TextField
            label="Narration"
            variant="outlined"
            fullWidth
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            required
          />

          <Box display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary">
              Save Payment
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
      ) : (
        <Box textAlign="center" mt={2}>
          {saveResponse.status === "200" ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              {saveResponse.message}
            </Alert>
          ) : (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveResponse.message}
            </Alert>
          )}

          <Button
            variant="contained"
            color="secondary"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {saveError}
        </Alert>
      )}
    </Paper>
  );
};

export default PaymentSavingForm;
