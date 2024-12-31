import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StudentIdForm from "./StudentIdForm";
import AccountValidationForm from "./AccountValidationForm";
import PaymentSavingForm from "./PaymentSavingForm";

const steps = ["Student Verification", "Account Verification", "Review and Pay"];

export default function PaymentSteps() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [studentId, setStudentId] = React.useState("");
  const [totalOutstandingFee, setTotalOutstandingFee] = React.useState(0);
  const [studentFullName, setStudentFullName] = React.useState("");
  const [transactionId, setTransactionId] = React.useState("");
  const [months, setMonths] = React.useState([]);
  const [amounts, setAmounts] = React.useState([]);
  const [grade, setGrade] = React.useState("");
  const [school, setSchool] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [accountNumber, setAccountnumber] = React.useState("");
  const [phoneNumber, setPhone] = React.useState("");
  const [balance, setBalance] = React.useState("");


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setStudentId("");
    setTotalOutstandingFee(0);
    setStudentFullName("");
    setTransactionId("");
    setMonths([]);
    setAmounts([]);
    setGrade("");
    setSchool("");
  };

  const handleStudentIdSubmit = (studentId, responseData) => {
    setStudentId(studentId);
    setTotalOutstandingFee(responseData.totalOutstandingFee);
    setStudentFullName(responseData.studentFullName);
    setTransactionId(responseData.transactionId);
    setMonths(responseData.months);
    setAmounts(responseData.amounts);
    setGrade(responseData.grade);
    setSchool(responseData.school);

 //   handleNext(); // Move to the next step after submission
  };

  const handleAccountSubmit = (responseData) => {

    console.log("Response Data:", responseData);

    setCustomerName(responseData["Customer Name"]);
    setAccountnumber(responseData["Account Number"]);
    setPhone(responseData["Phone Number"]);
    setBalance(responseData["AvailableBalance"]);


 //   handleNext(); // Move to the next step after submission
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Step {activeStep + 1}: Student Verification
          </Typography>
          <StudentIdForm onSubmit={handleStudentIdSubmit} />
        
        </Box>
      );
    } else if (activeStep === 1) {
      return (
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Step {activeStep + 1}: Account Verification
          </Typography>
          <AccountValidationForm
            studentId={studentId}
            totalOutstandingFee={totalOutstandingFee}
            studentFullName={studentFullName}
            transactionId={transactionId}
            months={months}
            amounts={amounts}
            grade={grade}
            school={school}
            onSubmit={handleAccountSubmit}
          />
        </Box>
      );
    } else if (activeStep === 2) {
      return (
        <PaymentSavingForm
          paymentDetails={{
            studentId,
            totalOutstandingFee,
            studentFullName,
            transactionId,
            months,
            amounts,
            grade,
            school,
            accountNumber,
            customerName,
            phoneNumber,
          }}
        />
      );
    } else {
      return (
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you're finished
          </Typography>
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      );
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}

      {activeStep < steps.length && (
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="secondary"
            variant="contained"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep < steps.length - 1 && (
            <Button color="secondary" variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
