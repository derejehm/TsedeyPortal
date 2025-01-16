import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SavePaymentDetail } from "../../services/yayaServices";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Grid,
} from "@mui/material";

const PaymentSavingForm = ({ accountDetails, totalDue, onClear }) => {
  const narration = useRef();
  const [saveResponse, setSaveResponse] = useState(null);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: SavePaymentDetail,
    onSuccess: (data) => {
      console.log("Payment Saved Successfully:", data);
      setSaveResponse(data);
    },
    onError: (err) => {
      console.error("Error Saving Payment:", err);
      setSaveResponse(null);
    },
  });

  const handlePaymentSave = (e) => {
    e.preventDefault();

    // Validate accountDetails and totalDue
    if (!accountDetails || totalDue === undefined) {
      alert("Account details or total due amount is missing.");
      return;
    }

    const currentDate = new Date().toLocaleString();

    const requestPayload = {
      Amount: totalDue,
      Client_yaya_account: accountDetails.accountId,
      Client_Name: accountDetails.customerName,
      Customer_Account: accountDetails.accountNumber,
      Customer_Name: accountDetails.customerName,
      Customer_Phone_Number: accountDetails.phoneNumber,
      Transfer_To: "1201160002517",
      Branch_ID: localStorage.getItem("branch"),
      CreatedOn: currentDate,
      CreatedBy: localStorage.getItem("username"),
      Bill_ID: accountDetails.billId,
      Narration: narration.current.value,
    };

    console.log("Request Payload:", requestPayload);
    mutate(requestPayload);
  };

  const handleClear = () => {
    narration.current.value = "";
    setSaveResponse(null);
    onClear();
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
              inputRef={narration}
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
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Payment"}
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
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error?.response?.data?.message ||
            "An error occurred while saving the payment details."}
        </Alert>
      )}
    </Paper>
  );
};

export default PaymentSavingForm;
