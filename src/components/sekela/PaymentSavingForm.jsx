import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Divider,
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
      Branch_ID: "0101",
      Created_By: "Maker",
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
    Branch_ID: "0101",
    Created_By: "Maker",
    Created_On: new Date().toLocaleString(),
    Narration: narration,
    Transaction_ID: paymentDetails.transactionId,
    Months: paymentDetails.months.join(","),
    Amounts: paymentDetails.amounts.join(","),
    Grade: paymentDetails.grade,
    School: paymentDetails.school,
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, maxWidth: 600, margin: "auto" }}>
      {!saveResponse ? (
        <form onSubmit={handlePaymentSave}>
          <Typography variant="h6" gutterBottom>
            Save Payment Details
          </Typography>
          <TextField
            fullWidth
            label="Narration"
            variant="outlined"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Save Payment
          </Button>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Request Payload Preview:
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: "#f4f4f4",
              padding: 2,
              borderRadius: 1,
              overflow: "auto",
              maxHeight: 200,
            }}
          >
            <code>{JSON.stringify(requestPayloadPreview, null, 2)}</code>
          </Box>
        </form>
      ) : (
        <Box textAlign="center">
          {saveResponse.status === "200" ? (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {saveResponse.message}
            </Alert>
          ) : (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {saveResponse.message}
            </Alert>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClear}
            fullWidth
          >
            Clear
          </Button>
        </Box>
      )}
      {saveError && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {saveError}
        </Alert>
      )}
      <Typography variant="body2" color="text.secondary" align="right" sx={{ marginTop: 2 }}>
        Total Outstanding Fee: {paymentDetails.totalOutstandingFee}
      </Typography>
    </Paper>
  );
};

export default PaymentSavingForm;
