import React, { useState } from "react";
import axios from "axios";
import AccountValidationForm from "./AccountValidationForm";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
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
  const [months, setMonths] = useState([]);
  const [amounts, setAmounts] = useState([]);
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
      setMonths(response.data.months.split(",").map((item) => item.trim()));
      setAmounts(
        response.data.amounts.split(",").map((item) => parseFloat(item.trim()))
      );
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
    <Box m={3}>
      {/* <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: "100%" }}> */}
      {!isStudentValidated ? (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Student Fee Validation
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          <TextField
            fullWidth
            label="Student ID"
            variant="outlined"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
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
                color="secondary"
                fullWidth
                onClick={handleClear}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ marginTop: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      ) : (
        // <Box>
        //   <Typography variant="h6">Student Details</Typography>
        //   <Divider sx={{ marginBottom: 2 }} />
        //   <Typography>Student Name: {studentFullName}</Typography>
        //   <Typography>Total Outstanding Fee: {totalOutstandingFee}</Typography>
        //   <Typography>Grade: {grade}</Typography>
        //   <Typography>School: {school}</Typography>

        <Box mt={3} p={2} border="1px solid" borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            Student Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong> Student Name:</strong>  {studentFullName.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong>Total Outstanding Fee:</strong>  {totalOutstandingFee}
          </Typography>
          <Typography variant="body1">
            <strong> Grade: </strong> {grade.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong> School:  </strong> {school.toUpperCase()}
          </Typography>



          {totalOutstandingFee > 0 ? (
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
          ) : (
            <Alert severity="success" sx={{ marginTop: 2 }}>
              Bill is already paid.
            </Alert>
          )}
        </Box>
      )}
      {/* </Paper> */}
    </Box>
  );
};

export default StudentIdForm;
