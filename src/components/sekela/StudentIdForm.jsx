import React, { useState } from "react";
import axios from "axios";
import AccountValidationForm from "./AccountValidationForm";
import { Alert, AlertTitle, Box, Button, TextField } from "@mui/material";

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
      // Split the months and amounts string into arrays
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
    <Box justifyContent="flex" >
      {!isStudentValidated ? (



        <form onSubmit={handleSubmit} >
          <Box alignContent="flex">

            <Box className="flex gap-3 w-full">
              <TextField
                sx={{ pr: "10px" }}
                margin="normal"
                required
                id="studentId"
                label="Student Id"
                name="studentId"
                autoComplete="studentId"
                autoFocus
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}

              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-start',
                  gap: 1,
                  mt: 3,
                  mb: 2
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ flex: 1, mr: 1 }}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ flex: 1, ml: 1 }}
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      ) : null}

      {error && <p className="error text-red italic font-bold">{error}</p>}

      {responseData && (

        <Alert severity="success">
          <AlertTitle>Student : {studentFullName.toUpperCase()}</AlertTitle>
          <AlertTitle>Total Outstanding Fee: {totalOutstandingFee}</AlertTitle>
        </Alert>
        // <div className="text-left text-md font-bold mt-5 text-dark-eval-1">
        //   <p>Student: {studentFullName}</p>
        //   <p>Total Outstanding Fee: {totalOutstandingFee}</p>
        // </div>
      )}

      {isStudentValidated && (
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
      )}
    </Box>
  );
};

export default StudentIdForm;
