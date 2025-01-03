import React, { useState } from "react";
import  {SekelaSavePayment} from "../../services/sekelaServices";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Table, TableBody, TableCell, TableHead, TableRow, Paper
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

   const response= await SekelaSavePayment(requestPayload);
    if (response=="200") {
      console.log("Response:", response);
      setSaveResponse(response);
    }
    else {
      setSaveError(response.data.message);
    }
  }
 
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
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        margin: "16px auto",

      }}
    >
      {!saveResponse ? (
        
        <Box
          component="form"
          onSubmit={handlePaymentSave}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          
          <Typography variant="h6" gutterBottom>
            Save Payment
          </Typography>
          {saveError && (
        <Alert severity="error" sx={{ marginTop: "16px" }}>
          {saveError}
        </Alert>
      )}
          <TextField
            fullWidth
            variant="outlined"
            label="Payment Narration"
            placeholder="Enter Payment Narration"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            required
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "48%" }}
            >
              Save Payment
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ width: "48%" }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Please reivew before continue Preview:
            </Typography>
       
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }}>
           
                  <TableBody>
                    {Object.entries(requestPayloadPreview).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
           
          </Box>
        </Box>
      ) : (
        <Box>
          <Alert
            severity={saveResponse.status === "200" ? "success" : "error"}
            sx={{ marginBottom: "16px" }}
          >
            <AlertTitle>
              {saveResponse.status === "200"
                ? "Payment Saved Successfully"
                : "Payment Save Failed"}
            </AlertTitle>
            {saveResponse.message}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClear}
            sx={{ marginTop: "16px" }}
          >
            Clear
          </Button>
        </Box>
      )}
    
      <Typography variant="body2" sx={{ marginTop: "16px" }}>
        Total: {paymentDetails.totalOutstandingFee}
      </Typography>
    </Paper>
  );
};

export default PaymentSavingForm;
