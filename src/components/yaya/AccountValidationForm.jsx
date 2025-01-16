import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GetCustomerDetail } from "../../services/yayaServices"; // Import from yayaServices
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
  billId,
  accountId,
  totalDue,
  accountName,
  onClear,
}) => {
  const accountNumberRef = useRef(); // Use ref instead of state for account number
  const [accountResponse, setAccountResponse] = useState(null);
  const { mutate, error, isError, isPending } = useMutation({
    mutationFn: GetCustomerDetail,
    onSuccess: (data) => {
      console.log("Account Response:", data);
      setAccountResponse(data);
    },
    onError: (error) => {
      console.log("Error fetching customer details", error);
    },
  });

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    const accountNumber = accountNumberRef.current.value;
    mutate({ billId, accountId, accountNumber }); // Call with the necessary arguments
  };

  const handleClear = () => {
    setAccountResponse(null);
    if (onClear) {
      onClear(); // Call clear function passed from parent
    }
  };

  const canShowPaymentSavingForm =
    accountResponse &&
    accountResponse.status === "200" &&
    parseFloat(accountResponse.extraData?.AvailableBalance) > 0 &&
    totalDue > 0 &&
    totalDue < parseFloat(accountResponse.extraData?.AvailableBalance);

  const availableBalance =
    parseFloat(accountResponse?.extraData?.["AvailableBalance"]) || 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Account Number Submission Form */}
      {(!accountResponse ||
        accountResponse.status !== "200" ||
        totalDue >= availableBalance) && (
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
                  inputRef={accountNumberRef} // Use ref
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isPending}
                >
                  {isPending ? "Validating..." : "Validate"}
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

      {/* Error Handling */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "An error occurred while fetching account details."}
        </Alert>
      )}

      {/* Customer Details Display */}
      {accountResponse && accountResponse.status === "200" && (
        <Box
          mt={3}
          p={2}
          border="1px solid"
          borderColor="grey.300"
          borderRadius={2}
        >
          <Typography variant="h6" gutterBottom>
            Account Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong> Customer Name: </strong>{" "}
            {accountResponse.extraData["Customer Name"]?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong>Account Number: </strong>{" "}
            {accountResponse.extraData["Account Number"]}
          </Typography>
          <Typography variant="body1">
            <strong>Phone Number: </strong>{" "}
            {accountResponse.extraData["Phone Number"]}
          </Typography>
          <Typography variant="body1">
            <strong>Available Balance:</strong> {availableBalance.toFixed(2)}
            {totalDue >= availableBalance && (
              <span style={{ color: "red", fontStyle: "italic" }}>
                {" - Insufficient Balance"}
              </span>
            )}
          </Typography>
        </Box>
      )}

      {/* Show Payment Saving Form if conditions met */}
      {canShowPaymentSavingForm && (
        <PaymentSavingForm
          accountDetails={{
            billId,
            accountId,
            accountNumber: accountResponse.extraData["Account Number"],
            customerName: accountResponse.extraData["Customer Name"],
            phoneNumber: accountResponse.extraData["Phone Number"],
          }}
          totalDue={totalDue}
          onClear={handleClear}
        />
      )}
    </Box>
  );
};

export default AccountValidationForm;
