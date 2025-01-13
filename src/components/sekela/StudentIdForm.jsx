import React, { useState } from "react";
import axios from "axios";
import AccountValidationForm from "./AccountValidationForm";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Alert,
  Divider,
} from "@mui/material";

const StudentIdForm = () => {
  const [studentId, setStudentId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isStudentValidated, setIsStudentValidated] = useState(false);
  const [totalOutstandingFee, setTotalOutstandingFee] = useState(0);
  const [studentFullName, setStudentFullName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [months, setMonths] = useState([]); // Set as array
  const [amounts, setAmounts] = useState([]); // Set as array
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      Branch_ID: "0101",
      User_ID: "mikiyas",
      Student_ID: studentId,
    };

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/Portals/GetStudentFees",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status !== true) {
        setError(response.data.message || "An unknown error occurred.");
        setResponseData(null);
        return;
      }

      setResponseData(response.data);
      setTotalOutstandingFee(response.data.data.totalOutstandingFee);
      setStudentFullName(response.data.data.student.fullName);
      setTransactionId(response.data.transaction_ID);
      setMonths(response.data.months.split(",").map((item) => item.trim())); // Convert to array
      setAmounts(
        response.data.amounts.split(",").map((item) => parseFloat(item.trim()))
      ); // Convert to array of numbers
      setGrade(response.data.data.student.grade);
      setSchool(response.data.data.student.school);
      setIsStudentValidated(true);
      setError(null);
    } catch (err) {
      console.error("Error Details: ", err);
      setError("An error occurred while retrieving student fees.");
      setResponseData(null);
      setIsStudentValidated(false);
    }
  };

  const handleClear = () => {
    setStudentId("");
    setResponseData(null);
    setError(null);
    setIsStudentValidated(false);
    setTotalOutstandingFee(0);
    setStudentFullName("");
    setTransactionId("");
    setMonths([]);
    setAmounts([]);
    setGrade("");
    setSchool("");
  };

  return (
    <Box >
      {!isStudentValidated ? (
        <Paper
          elevation={3}
          sx={{ p: 4,  mb: 3 }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter Student ID:
            </Typography>
            <TextField
              fullWidth
              label="Student ID"
              variant="outlined"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
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
                >
                  Submit
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
      ) : null}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {responseData && (
        <Box mt={3} p={2} border="1px solid" borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
          Student Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong> Name : </strong> {studentFullName?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong>Total Outstanding Fee : </strong> {totalOutstandingFee}
          </Typography>
      
        </Box>
      )}

      {isStudentValidated && totalOutstandingFee > 0 ? (
        <AccountValidationForm
          studentId={studentId}
          totalOutstandingFee={totalOutstandingFee}
          studentFullName={studentFullName}
          transactionId={transactionId}
          months={months}
          amounts={amounts}
          grade={grade}
          school={school}
          onClear={handleClear}
        />
      ) : isStudentValidated && totalOutstandingFee === 0 ? (

        <Alert sx={{ mt: 3 }}> Bill is already paid.</Alert>
      ) : null}
    </Box>
  );
};

export default StudentIdForm;
