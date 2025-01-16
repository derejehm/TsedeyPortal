import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import AccountValidationForm from "./AccountValidationForm";
import { useMutation } from "@tanstack/react-query";
import { GetPendingBill } from "../../services/yayaServices";
import Header from "../../components/Header";
import yayaLogo from "../../assets/images/yaya.png";

const BillIdForm = () => {
  const billIdRef = useRef();
  const [accountId, setAccountId] = useState("");
  const [fillData, setFillData] = useState(null);

  const { mutate, data, error, isError, isPending, reset } = useMutation({
    mutationFn: GetPendingBill,
    onSuccess: (responseData) => {
      console.log("Bill Validation Response:", responseData);

      setFillData({
        billId: billIdRef.current.value,
        dueDate: responseData.dueDate,
        dueAmount: responseData.dueAmount,
        accountID: responseData.accountID,
        accountName: responseData.accountName,
        amountDue: responseData.extraData?.AmountDue,
        serviceCharge: responseData.extraData?.ServiceCharge,
        totalDue: responseData.extraData?.TotalDue,
      });
    },
    onError: (error) => {
      console.log("Bill ID Error", error);
    },
  });

  const handleClear = () => {
    reset();
    setFillData(null);
    setAccountId("");
    billIdRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      billId: billIdRef.current.value,
      accountId,
    };

    mutate(requestBody);
  };

  return (
    <Box m={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="YAYA" subtitle="Welcome to YAYA payment" />
        <img src={yayaLogo} alt="Yaya logo" height="100px" />
      </Box>

      {/* Bill ID Form Submission */}
      {!data ? (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="accountId-label">Select Account</InputLabel>
            <Select
              labelId="accountId-label"
              id="accountId"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              <MenuItem value="" disabled>
                Select Account
              </MenuItem>
              <MenuItem value="amhararbor11">
                AMHARA NATIONAL REGIONAL STATE REVENUE AUTHORITY
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Enter Bill ID"
            id="billId"
            variant="outlined"
            fullWidth
            inputRef={billIdRef}
            required
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isPending}
              >
                {isPending ? "Validating..." : "Submit"}
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
      ) : null}

      {/* Error Handling */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.status === 404 ? "Bill ID not found!" : error?.message}
        </Alert>
      )}

      {/* Response Data Display */}
      {fillData && (
        <Box
          mt={3}
          p={2}
          border="1px solid"
          borderColor="grey.300"
          borderRadius={2}
        >
          <Typography variant="h6" gutterBottom>
            Bill Details:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong> Bill Id:</strong> {fillData.billId}
          </Typography>
          <Typography variant="body1">
            <strong> Due Date:</strong> {fillData.dueDate ?? "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong> Due Amount:</strong> {fillData.dueAmount}
          </Typography>
          <Typography variant="body1">
            <strong> Account ID:</strong> {fillData.accountID}
          </Typography>
          <Typography variant="body1">
            <strong> Account Name:</strong> {fillData.accountName}
          </Typography>
          <Typography variant="body1">
            <strong> Amount Due:</strong> {fillData.amountDue}
          </Typography>
          <Typography variant="body1">
            <strong> Service Charge:</strong> {fillData.serviceCharge}
          </Typography>
          <Typography variant="body1">
            <strong> Total Due:</strong> {fillData.totalDue}
          </Typography>
        </Box>
      )}

      {/* Conditional Rendering for Account Validation Form */}
      {fillData && fillData.totalDue > 0 ? (
        <AccountValidationForm
          billId={fillData.billId}
          totalDue={fillData.totalDue}
          accountName={fillData.accountName}
          onClear={handleClear}
          accountId={fillData.accountID}
        />
      ) : fillData && fillData.totalDue === 0 ? (
        <Typography mt={3} color="success.main" variant="h5" fontStyle="italic">
          Bill is already paid.
        </Typography>
      ) : null}
    </Box>
  );
};

export default BillIdForm;
