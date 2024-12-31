import React, { useState } from "react";
import axios from "axios";
import { Alert, AlertTitle, Box, Button, TextField, Typography } from "@mui/material";

const StudentIdForm = ({ onSubmit }) => {
  const [studentId, setStudentId] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isStudentValidated, setIsStudentValidated] = useState(false);
  const [totalOutstandingFee, setTotalOutstandingFee] = useState('');
  const [studentFullName, setStudentFullName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [months, setMonths] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');

  const resetForm = () => {
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
    localStorage.clear();
  };

  const handleApiError = (message) => {
    setError(message || "An unknown error occurred.");
    setResponseData(null);
    setIsStudentValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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

      if (!response.data?.status) {
        handleApiError(response.data?.message);
        return;
      }
      const data = response.data.data;

      console.log("Submitting Student Data:", {
        totalOutstandingFee: data.totalOutstandingFee,
        studentFullName: data.student.fullName,
        transactionId: response.data.transaction_ID,
        months: response.data.months.split(",").map((item) => item.trim()),
        amounts: response.data.amounts.split(",").map((item) => parseFloat(item.trim())),
        grade: data.student.grade,
        school: data.student.school,
      });
  
    

      setResponseData(response.data);
      setTotalOutstandingFee(data.totalOutstandingFee);
      setStudentFullName(data.student.fullName);
      setTransactionId(response.data.transaction_ID);
      setMonths(response.data.months.split(",").map((item) => item.trim()));
      setAmounts(response.data.amounts.split(",").map((item) => parseFloat(item.trim())));
      setGrade(data.student.grade);
      setSchool(data.student.school);
      setIsStudentValidated(true);

      // Pass the data to the parent component
      onSubmit(studentId, 
        {
          totalOutstandingFee: data.totalOutstandingFee,
          studentFullName: data.student.fullName,
          transactionId: response.data.transaction_ID,
          months: response.data.months.split(",").map((item) => item.trim()),
          amounts: response.data.amounts.split(",").map((item) => parseFloat(item.trim())),
          grade: data.student.grade,
          school: data.student.school,
        
      });
    } catch (err) {
      handleApiError("An error occurred while retrieving student fees.");
    }
  };

  return (
    <Box>
      {!isStudentValidated ? (
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              margin="normal"
              required
              id="studentId"
              label="Student ID"
              name="studentId"
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button type="button" variant="outlined" color="secondary" onClick={resetForm}>
                Clear
              </Button>
            </Box>
          </Box>
        </form>
      ) : null}

      {error && (
        <Alert severity="error" sx={{ marginTop: "16px" }}>
          {error}
        </Alert>
      )}

      {responseData && isStudentValidated && (
        <Alert severity="success" sx={{ marginTop: "16px" }}>
          <AlertTitle>
            Student: {studentFullName.toUpperCase()} - Grade: {grade}
          </AlertTitle>
          <Typography>
            Total Outstanding Fee: <strong>{totalOutstandingFee}</strong>
          </Typography>
          <Typography>School: {school}</Typography>
          <Typography>Months: {months}</Typography>
        </Alert>
      )}
    </Box>
  );
};

export default StudentIdForm;
