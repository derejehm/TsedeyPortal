import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Grid,
} from "@mui/material";

const PaymentSavingForm = ({ paymentDetails, onClear }) => {
  const [narration, setNarration] = useState("");
  const [saveResponse, setSaveResponse] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const handlePaymentSave = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toLocaleString();

    const requestPayload = {
      Student_ID: paymentDetails.studentId,
      Total_Amount: paymentDetails.totalOutstandingFee.toString(),
      Customer_Account: paymentDetails.accountNumber,
      Customer_Name: paymentDetails.customerName,
      Student_Name: paymentDetails.studentFullName,
      To_Account: "2305130003340",
      Customer_Phone: paymentDetails.phoneNumber,
      Branch_ID:  localStorage.getItem('branch'),
      Created_By: localStorage.getItem("username"),
      Created_On: currentDate,
      Narration: narration,
      Transaction_ID: paymentDetails.transactionId,
      Months: paymentDetails.months.join(","),
      Amounts_Per_Month: paymentDetails.amounts.join(","),
      Grade: paymentDetails.grade,
      School: paymentDetails.school,
    };

    console.log("Request Payload:", requestPayload);

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/Portals/SekelaSavePayment",
        requestPayload,
        { headers: { "Content-Type": "application/json" } }
      );
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
    onClear();
  };

  const requestPayloadPreview = {
    Student_ID: paymentDetails.studentId,
    Total_Amount: paymentDetails.totalOutstandingFee.toString(),
    Customer_Account: paymentDetails.accountNumber,
    Customer_Name: paymentDetails.customerName,
    Student_Name: paymentDetails.studentFullName,
    To_Account: "2305130003340",
    Customer_Phone: paymentDetails.phoneNumber,
    Branch_ID: localStorage.getItem('branch'),
    Created_By:localStorage.getItem("username"),
    Created_On: new Date().toLocaleString(),
    Narration: narration,
    Transaction_ID: paymentDetails.transactionId,
    Months: paymentDetails.months.join(","),
    Amounts: paymentDetails.amounts.join(","),
    Grade: paymentDetails.grade,
    School: paymentDetails.school,
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
      {!saveResponse ? (
        <form onSubmit={handlePaymentSave}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Payment Narration"
              variant="outlined"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              required
            />
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Save Payment
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
         
        </form>
      ) : (
        <Box textAlign="left" mt={5}>
          {saveResponse.status === "200" ? (
            <Typography variant="h5" color="success.main" gutterBottom>
              {saveResponse.message}
            </Typography>
          ) : (
            <Typography variant="h5" color="error.main" gutterBottom>
              {saveResponse.message}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleClear}
            sx={{ mt: 2 }}
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
      <Typography variant="body2" color="text.secondary" mt={1}>
        Total: {paymentDetails.totalOutstandingFee}
      </Typography>
    </Paper>
  );
};

export default PaymentSavingForm;
