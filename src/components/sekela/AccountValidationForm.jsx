import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GetCustomerDetail } from "../../services/sekelaServices";
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
  const accountNumber = useRef();
  const [accountResponse, setAccountResponse] = useState(null);

  const { mutate,  error, isError, isPending } = useMutation({
    mutationFn: GetCustomerDetail,
    onSuccess: (data) => {
      console.log(data);
      setAccountResponse(data);

    },
    onError: (error) => {
      console.log("Student Error", error);
    }
  });

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    mutate(accountNumber.current.value);

  };

  const handleClear = () => {
    setAccountResponse(null);
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
      {(accountResponse && accountResponse.status === "200" && totalOutstandingFee < availableBalance) ? null : (
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
                  inputRef={accountNumber}
                  // value={accountNumber.current}
                  //onChange={(e) => setAccountNumber(e.target.value)}
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
                 {isPending ?"Validating ... " :"Validate"} 
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

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      {(accountResponse && accountResponse.status === "200") && (

        <Box mt={3} p={2} border="1px solid" borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            Account Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong> Customer Name: </strong> {accountResponse.extraData["Customer Name"]?.toUpperCase()}
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
