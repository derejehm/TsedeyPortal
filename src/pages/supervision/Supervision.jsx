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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";


const PAYMENT_TYPES = [
  { id: "All", label: "All Pending Payments" },
  { id: "YaYa", label: "YaYa Pending Payments" },
  { id: "Sekela", label: "Sekela Pending Payments" },
];

const usePendingPaymentModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [payment, setPayment] = useState(null);

  const openModal = (selectedPayment) => {
    setPayment(selectedPayment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPayment(null);
  };

  return {
    modalOpen,
    payment,
    openModal,
    closeModal,
  };
};

const PaymentSupervision = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState("All");
  const rowsPerPage = 4;

  const { modalOpen, payment, openModal, closeModal } =
    usePendingPaymentModal();

  const handleReview = (payment) => {
    console.log("Opening modal for payment:", payment);
    openModal(payment);
  };
  const fetchPendingPayments = async () => {
    const branchID = localStorage.getItem("branch");
    const userID = localStorage.getItem("username");
    const requestBody = { BranchID: branchID, User_ID: userID };
    const endpoint =
      "http://10.10.105.21:7271/api/Portals/AccessConsolidatedPendingPayment";

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

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
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results = pendingPayments.filter((payment) => {
      const isPaymentTypeMatch =
        paymentType === "All" ||
        (paymentType === "YaYa" && payment.source === "YaYa") ||
        (paymentType === "Sekela" && payment.source === "Sekela");

      const isSearchMatch =
        (payment.amount &&
          payment.amount.toString().toLowerCase().includes(lowerSearchTerm)) ||
        (payment.customerName &&
          payment.customerName.toLowerCase().includes(lowerSearchTerm)) ||
        (payment.customerAccount &&
          payment.customerAccount.toLowerCase().includes(lowerSearchTerm)) ||
        (payment.client_Name &&
          payment.client_Name.toLowerCase().includes(lowerSearchTerm)) ||
        (payment.student_Name &&
          payment.student_Name.toLowerCase().includes(lowerSearchTerm));

      return isPaymentTypeMatch && isSearchMatch;
    });
    setFilteredPayments(results);
    setCurrentPage(1); // Reset to the first page whenever filtering occurs
  }, [pendingPayments, paymentType, searchTerm]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleApprove = async (payment) => {
    let requestBody;
    console.log("approving payment:", payment);
    // Prepare request according to payment type
    if (payment.source === "YaYa") {
      requestBody = {
        CustomerID: "Dawit",
        Country: "ETHIOPIATEST",
        BankID: "02",
        UniqueID: payment.customerAccount,
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
          InfoField3: payment.customerName,
          InfoField7: payment.customerAccount,
          InfoField15: payment.transfer_To,
          InfoField16: payment.narration,
          InfoField17: payment.branchID,
          InfoField18: payment.createdOn.toString(),
          InfoField19: localStorage.getItem("username"),
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
    } else if (payment.source === "Sekela") {
      requestBody = {
        Student_ID: payment.student_ID,
        Total_Amount: payment.amount,
        Customer_Account: payment.customerAccount,
        To_Account: payment.to_Account,
        Branch_ID: payment.branchID,
        Created_By: localStorage.getItem("username"),
        Created_On: payment.created_On,
        Narration: payment.narration,
        Transaction_ID: payment.transaction_ID,
      };

      console.log(requestBody);
    } else {
      return; // Exit if no valid payment type is found
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    let endpoint;

    if (payment.source === "YaYa") {
      endpoint = "http://10.10.105.21:7271/api/YAYA/B2YaYa";
    } else if (payment.source === "Sekela") {
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
        closeModal();
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
    // console.log("approving payment:", payment);

    if (payment.source === "YaYa") {
      requestBody = {
        Bill_ID: payment.bill_ID,
        Customer_Account: payment.customerAccount,
        Client_yaya_account: payment.client_yaya_account,
        Branch_ID: payment.branchID,
        RejectedON: new Date().toLocaleString(),
        RejectedBy: localStorage.getItem("username"),
      };
    } else if (payment.source === "Sekela") {
      requestBody = {
        Student_ID: payment.student_ID,
        Customer_Account: payment.customerAccount,
        To_Account: payment.to_Account,
        Branch_ID: payment.branchID,
        RejectedON: new Date().toLocaleString(),
        RejectedBy: localStorage.getItem("username"),
      };

      console.log(requestBody);
    } else {
      return; // Exit if no valid payment type is found
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    let endpoint;

    if (payment.source === "YaYa") {
      endpoint = "http://10.10.105.21:7271/api/Portals/RejectPayement";
    } else if (payment.source === "Sekela") {
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
        setSuccessMessage("Payment rejected successfully!");
        closeModal();
        await fetchPendingPayments();
      }
    } catch (err) {
      console.error("Error rejecting payment:", err);
      setError(err.response?.data?.message || "Failed to reject payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredPayments.slice(startIndex, endIndex);

  return (
    <Box p={3}>
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        aria-labelledby="payment-review-title"
        aria-describedby="payment-review-description"
      >
        <DialogTitle id="payment-review-title">
          Review Payment Details
        </DialogTitle>
        <DialogContent>
          {payment ? (
            <Box
              mt={3}
              p={2}
              border="1px solid"
              borderColor="grey.300"
              borderRadius={2}
            >
              <Typography variant="h6" gutterBottom>
                Review Payment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                <strong>Type:</strong> {payment.source}
              </Typography>
              {payment.source === "YaYa" ? (
                <>
                  <Typography variant="body1">
                    <strong>Amount:</strong> {payment.amount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Customer Name:</strong> {payment.customerName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Customer Account:</strong> {payment.customerAccount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone Number:</strong>{" "}
                    {payment.customer_Phone_Number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Narration:</strong> {payment.narration}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created On:</strong> {payment.createdOn}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created By:</strong> {payment.createdBy}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1">
                    <strong>Amount:</strong> {payment.amount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>months:</strong> {payment.months}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Amounts Per Month:</strong>{" "}
                    {payment.amounts_Per_Month}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Student Name:</strong> {payment.student_Name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Customer Account:</strong> {payment.customerAccount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone Number:</strong>{" "}
                    {payment.customer_Phone_Number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Transaction ID:</strong> {payment.transaction_ID}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created On:</strong> {payment.createdOn}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created By:</strong> {payment.createdBy}
                  </Typography>
                </>
              )}
            </Box>
          ) : (
            <Typography>No payment details available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (payment) {
                handleApprove(payment);
              }
              closeModal();
            }}
            color="success"
          >
            Confirm
          </Button>

          <Button
            onClick={() => {
              if (payment) {
                handleReject(payment);
              }
              closeModal();
            }}
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {(successMessage || error) && (
        <Alert severity={successMessage ? "success" : "error"}>
          {successMessage || error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        Pending Payments
      </Typography>

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
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Customer/Student Name</TableCell>
                    <TableCell>Customer Account</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created On</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((row) => (
                    <TableRow key={row.customer_Account}>
                      <TableCell>{row.source}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>
                        {row.source === "YaYa"
                          ? row.customerName
                          : row.source === "Sekela"
                          ? row.student_Name
                          : ""}
                      </TableCell>
                      <TableCell>{row.customerAccount}</TableCell>
                      <TableCell>{row.customer_Phone_Number}</TableCell>
                      <TableCell>{row.createdBy}</TableCell>
                      <TableCell>{row.createdOn}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleReview(row)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No pending payments found.</Typography>
          )}
          <Pagination
            count={Math.ceil(filteredPayments.length / rowsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </Box>
  );
};

export default PaymentSupervision;
