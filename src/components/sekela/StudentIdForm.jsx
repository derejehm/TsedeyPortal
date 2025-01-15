import React, { useRef, useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { GetStudentFees } from "../../services/sekelaServices";

const StudentIdForm = () => {
  const studentId = useRef();
  const [fillData, setFillData] = useState();


  const { mutate, data, error, isError, isPending, reset } = useMutation({
    mutationFn: GetStudentFees,
    onSuccess: (data) => {

      console.log(data);
      setFillData({
        student_id: studentId.current.value,
        totalOutstandingFee: data.data?.totalOutstandingFee,
        grade: data.data.student?.grade,
        school: data.data.student?.school,
        studentFullName: data.data?.student?.fullName,
        transactionId: data?.transaction_ID,
        amounts: data?.amounts,
        months: data?.months

      });

    },
    onError: (error) => {
      console.log("Student Error", error);
    }
  })

  const handleClear = () => {
    reset();
    setFillData({});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      Branch_ID: localStorage.getItem('branch'),
      User_ID: localStorage.getItem('username'),
      Student_ID: studentId.current.value,
    };

    mutate(requestBody);
  }

  return (
    <Box >
      {!data ? (
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 3 }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter Student ID:
            </Typography>
            <TextField
              fullWidth
              label="Student ID"
              variant="outlined"
              inputRef={studentId}
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
        </Paper>
      ) : null}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.status === 404 ? "Student id is not found!" : error.message}
        </Alert>
      )}

      {data && (
        <Box mt={3} p={2} border="1px solid" borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            Student Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong> Name : </strong> {fillData.studentFullName?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong> Student Id : </strong> {fillData.student_id?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong> Grade : </strong> {fillData.grade?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong> Shool : </strong> {fillData.school?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong> Months : </strong> {fillData.months?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong> Amounts : </strong> {fillData.amounts?.toUpperCase()}
          </Typography>
          <Typography variant="body1">
            <strong>Total Outstanding Fee : </strong> {fillData.totalOutstandingFee}
          </Typography>

        </Box>
      )}

      {data && fillData.totalOutstandingFee > 0 ? (
        <AccountValidationForm
          studentId={fillData.student_id}
          totalOutstandingFee={fillData.totalOutstandingFee}
          studentFullName={fillData.studentFullName}
          transactionId={fillData.transactionId}
          months={fillData.months}
          amounts={fillData.amounts}
          grade={fillData.grade}
          school={fillData.school}
          onClear={handleClear}
        />
      ) : data && fillData.totalOutstandingFee === 0 ? (

        <Alert sx={{ mt: 3 }}> Bill is already paid.</Alert>
      ) : null}
    </Box>
  );
};

export default StudentIdForm;
