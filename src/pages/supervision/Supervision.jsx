import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Pagination,
  Alert,
} from "@mui/material";

const PAYMENT_TYPES = [
  { id: "Yaya", label: "Yaya Pending Payments" },
  { id: "Sekela", label: "Sekela Pending Payments" },
];

const PaymentSupervision = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState(PAYMENT_TYPES[0].id);
  const rowsPerPage = 4;

  const fetchPendingPayments = async () => {
    const branchID = "0101";
    const userID = paymentType === "Yaya" ? "Dawit" : "test";
    const requestBody = { BranchID: branchID, User_ID: userID };

    let endpoint;
    if (paymentType === "Yaya") {
      endpoint = "http://10.10.105.21:7271/api/Portals/AccessPandingPayment";
    } else if (paymentType === "Sekela") {
      endpoint = "http://10.10.105.21:7271/api/Portals/AccessSekelaPendingPayment";
    } else {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      setPendingPayments(response.data);
      setFilteredPayments(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch payments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, [paymentType]);

  useEffect(() => {
    const results = pendingPayments.filter((payment) => {
      return (
        (payment.total_Amount &&
          payment.total_Amount.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.client_Name &&
          payment.client_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.student_Name &&
          payment.student_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.customer_Account &&
          payment.customer_Account.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredPayments(results);
    setCurrentPage(1);
  }, [searchTerm, pendingPayments]);

  const handleApprove = async (payment) => {
    let requestBody;

    if (paymentType === "Yaya") {
      requestBody = {
        CustomerID: "Dawit",
        Country: "ETHIOPIATEST",
        BankID: "02",
        UniqueID: payment.customer_Account,
        FunctionName: "GETNAME",
        ISOFieldsRequest: null,
        ISOFieldsResponse: null,
        PaymentDetails: {
          MerchantID: "YAYAPAYMENT",
          FunctionName: "GETNAME",
          AccountID: payment.client_yaya_account,
          Amount: payment.amount.toString(),
          ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
        },
        InfoFields: {
          InfoField1: payment.bill_ID,
          InfoField2: payment.customer_Phone_Number,
          InfoField3: payment.customer_Name,
          InfoField7: payment.customer_Account,
          InfoField15: payment.transfer_To,
          InfoField16: payment.narration,
          InfoField17: payment.branch_ID,
          InfoField18: payment.createdOn.toString(),
          InfoField19: "Checker",
        },
        MerchantConfig: {
          DLLCallID: "YAYAPAYMENT",
          MerchantCode: "YAYAPAYMENT",
          MerchantName: "YAYAPAYMENT",
          TrxAuthontication: null,
          MerchantProvider: "YAYA",
          MerchantURL: "https://localhost:44396/api/dynamic/Validate",
          MerchantReference: "{DATE}{STAN}",
        },
        ISOResponseFields: null,
        ResponseDetail: null,
        Customerdetail: {
          CustomerID: "1648094426",
          Country: "ETHIOPIATEST",
          MobileNumber: "251905557471",
          EmailID: "jack.njama@craftsilicon.com",
          FirstName: "Jack",
          LastName: "Njama",
          IMEI: null,
          IMSI: null,
          AppNotificationID: null,
        },
        ISORequest: null,
        ResponseFields: null,
        AppDetail: {
          AppName: "TSEDEY",
          Version: "1.8.17",
          CodeBase: "ANDROID",
          LATLON: "-1.2647891,36.7632677",
          TrxSource: "APP",
          DeviceNotificationID: "",
          DeviceIMEI: "148e122c64a564f2",
          DeviceIMSI: "148e122c64a564f2",
          ConnString: "",
        },
      };
    } else if (paymentType === "Sekela") {
      requestBody = {
        Student_ID: payment.student_ID,
        Total_Amount: payment.total_Amount,
        Customer_Account: payment.customer_Account,
        To_Account: payment.to_Account,
        Branch_ID: payment.branch_ID,
        Created_By: "Checker",
        Created_On: payment.created_On,
        Narration: payment.narration,
        Transaction_ID: payment.transaction_ID,
      };
    } else {
      return; // Exit if no valid payment type is found
    }

    setIsLoading(true);

    let endpoint;

    if (paymentType === "Yaya") {
      endpoint = "http://10.10.105.21:7271/api/YAYA/B2YaYa";
    } else if (paymentType === "Sekela") {
      endpoint = "http://10.10.105.21:7271/api/Portals/B2Sekela";
    } else {
      return; // Exit if no valid payment type is found
    }

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.status !== "200") {
        setError(response.data?.message);
      } else if (response.data?.status === "200") {
        setSuccessMessage("Payment approved successfully!");
        // Refresh the pending payments list after approval
        await fetchPendingPayments();
      }
    } catch (err) {
      console.error("Error approving payment:", err);
      setError(err.response?.data?.message || "Failed to approve payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (payment) => {
    let requestBody;

    if (paymentType === "Yaya") {
      requestBody = {
        Bill_ID: payment.bill_ID,
        Customer_Account: payment.customer_Account,
        Client_yaya_account: payment.client_yaya_account,
        Branch_ID: payment.branch_ID,
        RejectedON: new Date().toLocaleString(),
        RejectedBy: "Rejecter",
      };
    } else if (paymentType === "Sekela") {
      requestBody = {
        Student_ID: payment.student_ID,
        Customer_Account: payment.customer_Account,
        To_Account: payment.to_Account,
        Branch_ID: payment.branch_ID,
        RejectedON: new Date().toLocaleString(),
        RejectedBy: "Rejecter",
      };
    } else {
      return; // Exit if no valid payment type is found
    }

    setIsLoading(true);

    let endpoint;

    if (paymentType === "Yaya") {
      endpoint = "http://10.10.105.21:7271/api/Portals/RejectPayement";
    } else if (paymentType === "Sekela") {
      endpoint = "http://10.10.105.21:7271/api/Portals/RejectSekelaPayement";
    } else {
      return; // Exit if no valid payment type is found
    }

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data?.status !== "200") {
        setError(response.data?.message);
      } else if (response.data?.status === "200") {
        setSuccessMessage("Payment Rejected successfully!");
        // Refresh the pending payments list after rejection
        await fetchPendingPayments();
      }
    } catch (err) {
      console.error("Error rejecting payment:", err);
      setError(err.response?.data?.message || "Failed to reject payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredPayments.slice(startIndex, endIndex);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Pending Payments
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "40%" }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="payment-type-label">Payment Type</InputLabel>
          <Select
            labelId="payment-type-label"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            {PAYMENT_TYPES.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {currentRows.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{paymentType === "Yaya" ? "Amount" : "Total Amount"}</TableCell>
                    <TableCell>Client/Customer Name</TableCell>
                    <TableCell>{paymentType === "Yaya" ? "Customer Name" : "Student Name"}</TableCell>
                    <TableCell>Customer Account</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((payment) => (
                    <TableRow key={payment.rowID}>
                      <TableCell>{payment.total_Amount || payment.amount}</TableCell>
                      <TableCell>{payment.client_Name || payment.student_Name}</TableCell>
                      <TableCell>{payment.student_Name || payment.customer_Name}</TableCell>
                      <TableCell>{payment.customer_Account}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleApprove(payment)}
                            disabled={isLoading}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(payment)}
                            disabled={isLoading}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography textAlign="center" color="textSecondary" mt={3}>
              No pending payments available.
            </Typography>
          )}
        </>
      )}

      {currentRows.length > 0 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredPayments.length / rowsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PaymentSupervision;
