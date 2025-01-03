import React, { useState } from "react";
import { Alert, AlertTitle, Box, Button, TextField, Typography } from "@mui/material";
import { GetStudentFees } from "../../services/sekelaServices";

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
      const response = await GetStudentFees(requestBody);


      if (!response.status) {
        handleApiError(response.data?.message);
        return;
      }
      const data = response;    

      setResponseData(response);
      setTotalOutstandingFee(data.data.totalOutstandingFee);
      setStudentFullName(data.data.student.fullName);
      setTransactionId(data.transaction_ID);
      setMonths(data.months.split(",").map((item) => item.trim()));
      setAmounts(data.amounts.split(",").map((item) => parseFloat(item.trim())));
      setGrade(data.data.student.grade);
      setSchool(data.data.student.school);
      setIsStudentValidated(true);

      // Pass the data to the parent component
      onSubmit(studentId,
        {
          totalOutstandingFee: data.data.totalOutstandingFee,
          studentFullName: data.data.student.fullName,
          transactionId: data.transaction_ID,
          months: data.months.split(",").map((item) => item.trim()),
          amounts: data.amounts.split(",").map((item) => parseFloat(item.trim())),
          grade: data.data.student.grade,
          school: data.data.student.school,

        });
    } catch (err) {
      console.error("Error Details: ", err);
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
