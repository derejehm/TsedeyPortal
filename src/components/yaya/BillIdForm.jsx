import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Alert, Divider } from "@mui/material";
import AccountValidationForm from "./AccountValidationForm";
import { GetPendingBill } from "../../services/yayaServices";
import Header from "../../components/Header";
import yayaLogo from "../../assets/images/yaya.png"

const BillIdForm = () => {
  const [billId, setBillId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isBillValidated, setIsBillValidated] = useState(false);
  const [totalDue, setTotalDue] = useState(0);
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await GetPendingBill({ billId, accountId });

     // console.log("Response:", response);

      if (response.data.status !== "200") {
        setError(response.data.message || "An unknown error occurred.");
        setResponseData(null);
        setIsBillValidated(false);
        return;
      }

      setResponseData(response.data);
      setTotalDue(response.data.extraData?.TotalDue || 0);
      setAccountName(response.data.accountName);
      setIsBillValidated(true);
      setError(null);
    } catch (err) {
      console.error("Error Details: ", err);
      setError("An error occurred while validating the bill ID.");
      setResponseData(null);
      setIsBillValidated(false);
    }
  };

  const handleClear = () => {
    setBillId("");
    setResponseData(null);
    setError(null);
    setIsBillValidated(false);
    setTotalDue(0);
    setAccountId("");
  };

  return (
    <Box m={3}>
      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="YAYA" subtitle="Welcome to YAYA payment" />
      </Box> */}

      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="YAYA" subtitle="Welcome to YAYA payment" />
        <img
          src={yayaLogo}
          alt="Yaya logo"
          height="100px"
        />
      </Box>

      {!isBillValidated ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
            value={billId}
            onChange={(e) => setBillId(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Box display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
              Submit
            </Button>
            <Button onClick={handleClear} variant="contained" color="error">
              Clear
            </Button>
          </Box>
        </Box>
      ) : null}

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

      {responseData && (


        <Box mt={3} p={2} border="1px solid" borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            Bill Details:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong> Due Amount:</strong> {responseData.dueAmount || 0}
          </Typography>
          <Typography variant="body1">
            <strong>Account Number:</strong> {responseData.accountID}
          </Typography>
          <Typography variant="body1">
            <strong> Total Due:</strong> {responseData.extraData.TotalDue}
          </Typography>

        </Box>

      )}

      {isBillValidated && totalDue > 0 ? (
        <AccountValidationForm
          billId={billId}
          totalDue={totalDue}
          accountName={accountName}
          onClear={handleClear}
        />
      ) : isBillValidated && totalDue === 0 ? (
        <Typography mt={3} color="success.main" variant="h5" fontStyle="italic">
          Bill is already paid.
        </Typography>
      ) : null}
    </Box>
  );
};

export default BillIdForm;
