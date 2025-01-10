import React from "react";
import sekelaImage from "../../assets/images/sekela.png";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import PaymentStep from "../../components/sekela/PaymentSteps";

const Sekela = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Sekela" subtitle="Sekela School Fee Payment System" />
        <img
          src={sekelaImage}
          alt="Amhara National Regional State Revenue Authority"
          height="100px"
        />
      </Box>
      <Box>
        <PaymentStep />
        {/* <StudentIdForm /> */}
      </Box>


    </Box>

  );
};

export default Sekela;
