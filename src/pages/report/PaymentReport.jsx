import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import tsedeyLogo from "../../assets/images/logo.png";
import watermarkImage from "../../assets/images/tsedeylogo.png";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Typography,
} from "@mui/material";

const PAYMENT_TYPES = [
  { id: "Yaya", label: "Yaya Payments" },
  { id: "Sekela", label: "Sekela Payments" },
];

const PaymentReport = () => {
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const [paymentType, setPaymentType] = useState(PAYMENT_TYPES[0].id);

  // Function to convert number to words
  const convertNumberToWords = (num) => {
    if (num === 0) return "Zero";
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const thousands = ["", "Thousand", "Million", "Billion"];

    const convertChunkToWords = (chunk) => {
      let chunkWords = "";
      if (chunk > 99) {
        chunkWords += ones[Math.floor(chunk / 100)] + " Hundred ";
        chunk %= 100;
      }
      if (chunk > 19) {
        chunkWords += tens[Math.floor(chunk / 10)] + " ";
        chunk %= 10;
      }
      if (chunk > 0) {
        chunkWords += ones[chunk] + " ";
      }
      return chunkWords.trim();
    };

    let words = "";
    let thousandIndex = 0;
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        words =
          convertChunkToWords(chunk) +
          (thousands[thousandIndex] ? " " + thousands[thousandIndex] : "") +
          " " +
          words;
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }

    return words.trim();
  };

  useEffect(() => {
    const fetchApprovedPayments = async () => {
      const requestBody = {
        Branch_ID: localStorage.getItem("branch"),
        User_ID: localStorage.getItem("username"),
      };
      const endpoint =
        paymentType === "Yaya"
          ? "http://10.10.105.21:7271/api/Portals/GetReport"
          : "http://10.10.105.21:7271/api/Portals/SekelaGetReport";

      try {
        const response = await axios.post(endpoint, requestBody, {
          headers: { "Content-Type": "application/json" },
        });
        setApprovedPayments(response.data);
        setFilteredPayments(response.data);
      } catch (err) {
        console.error("Error fetching approved payments:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchApprovedPayments();
  }, [paymentType]);

  useEffect(() => {
    const results = approvedPayments.filter((payment) => {
      return (
        payment.amount
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.client_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer_Name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.customer_Account
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
    setFilteredPayments(results);
    setCurrentPage(1);
  }, [searchTerm, approvedPayments]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  const generatePDF = async (payment) => {
    console.log(payment);
    const doc = new jsPDF("p", "mm", "a4");

    try {
      const mainLogo = await loadImage(tsedeyLogo);
      const watermark = await loadImage(watermarkImage);

      // Logo
      const logoWidth = 40; // smaller logo width
      const logoHeight = (mainLogo.height / mainLogo.width) * logoWidth;
      doc.addImage(mainLogo, "PNG", 10, 10, logoWidth, logoHeight);

      // Payment Type Header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text(
        `${paymentType} Payment`,
        doc.internal.pageSize.getWidth() / 2,
        20,
        {
          align: "center",
        }
      );

      // Date
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 30);
      doc.line(10, 35, 200, 35); // Line separator
      let currentY = 40; // Start below the line

      // Payment Details Header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Payment Details", 10, (currentY += 5));
      currentY += 10;

      const paymentDetails =
        paymentType === "Yaya"
          ? [
              { label: "Transaction Ref:", value: payment.tsedey_Reference },
              { label: "YaYa Ref:", value: payment.yaya_Reference },
              { label: "Bill ID:", value: payment.bill_ID },
              { label: "Branch:", value: payment.branch_ID },
              { label: "Debit Account:", value: payment.customer_Account },
              { label: "Account Holder:", value: payment.customer_Name },
              { label: "Credit Account:", value: payment.transfer_To },
              { label: "Client Name:", value: payment.client_Name },
              {
                label: "Amount:",
                value: `${payment.amount} (${convertNumberToWords(
                  payment.amount
                ).toUpperCase()})`,
              }, // Remove "BIRR" from here
            ]
          : [
              { label: "Student ID:", value: payment.student_ID },
              { label: "Transaction Ref:", value: payment.tsedey_Reference },
              { label: "Branch ID:", value: payment.branch_ID },
              { label: "Debit Account:", value: payment.customer_Account },
              { label: "Student Name:", value: payment.student_Name },
              { label: "Account Holder:", value: payment.customer_Name },
              { label: "Months:", value: payment.months },
              { label: "Amounts Per Month:", value: payment.amounts_Per_Month },
              {
                label: "Total Amount:",
                value: `${payment.total_Amount} (${convertNumberToWords(
                  payment.total_Amount
                ).toUpperCase()})`,
              }, // Remove "BIRR" from here
            ];

      // Draw payment details as a compact table
      let lineHeight = 7; // Smaller line height for compactness
      paymentDetails.forEach(({ label, value }, index) => {
        const lineY = currentY + index * lineHeight;
        doc.text(label, 10, lineY);
        doc.text(value, 60, lineY); // Align value on the right
      });
      currentY += paymentDetails.length * lineHeight + 8; // Update currentY for additional information

      // Additional Information Header
      doc.setFont("Helvetica", "bold");
      doc.text("Additional Information", 10, currentY);
      currentY += 8;

      const additionalDetails =
        paymentType === "Yaya"
          ? [
              { label: "Created By:", value: payment.createdBy },
              { label: "Created On:", value: payment.createdOn },
              { label: "Approved By:", value: payment.approvedBy },
              { label: "Approved On:", value: payment.approvedOn },
              { label: "Narration:", value: payment.narration },
            ]
          : [
              { label: "Created By:", value: payment.created_By },
              { label: "Created On:", value: payment.created_On },
              { label: "Approved By:", value: payment.approved_By },
              { label: "Approved On:", value: payment.approved_On },
              { label: "Narration:", value: payment.narration },
            ];

      doc.setFont("Helvetica", "normal");
      additionalDetails.forEach(({ label, value }, index) => {
        const lineY = currentY + index * lineHeight;
        doc.text(label, 10, lineY);
        doc.text(value, 60, lineY); // Align value on the right
      });
      currentY += additionalDetails.length * lineHeight + 1; // Add space after details

      // Watermark
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scaledWidth = 260; // Adjusted size
      const scaledHeight = 260;
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      ctx.globalAlpha = 0.05; // Very subtle
      ctx.drawImage(watermark, 0, 0, scaledWidth, scaledHeight);
      const watermarkDataUrl = canvas.toDataURL("image/png");
      const watermarkX = (doc.internal.pageSize.getWidth() - scaledWidth) / 2;
      const belowTextY = currentY + 5;

      // Add watermark image to PDF
      doc.addImage(
        watermarkDataUrl,
        "PNG",
        watermarkX,
        belowTextY,
        scaledWidth,
        scaledHeight
      );

      doc.save(`Payment_Report_${payment.bill_ID || payment.student_ID}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate the PDF.");
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Approved Payments
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl variant="outlined">
          <InputLabel id="payment-type-label">Payment Type</InputLabel>
          <Select
            labelId="payment-type-label"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            label="Payment Type"
          >
            {PAYMENT_TYPES.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>
                {paymentType === "Yaya" ? "Customer Name" : "Student Name"}
              </TableCell>
              <TableCell>Customer Account</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow key={payment.rowID}>
                <TableCell>{payment.total_Amount || payment.amount}</TableCell>
                <TableCell>
                  {payment.client_Name || payment.student_Name}
                </TableCell>
                <TableCell>
                  {payment.student_Name || payment.customer_Name}
                </TableCell>
                <TableCell>{payment.customer_Account}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => generatePDF(payment)}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box marginTop={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredPayments.length / rowsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default PaymentReport;
