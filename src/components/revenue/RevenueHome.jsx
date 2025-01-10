import React from "react";
import { Card, CardContent, Typography, Grid,useTheme,Box } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import  sekelaLogo from "../../assets/images/sekela.png";
import yayaLogo from "../../assets/images/yaya.png"
import {  useNavigate } from "react-router-dom";


export default function RevenueHome() {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      const navigate=useNavigate();

  

   // Array of menu items with title and image URL
  const menuItems = [
    { 
      title: "SEKELA", 
      image:sekelaLogo,
      onClick: () =>  navigate( "/sekela")
    },
    { 
      title: "YAYA", 
      image: yayaLogo, 
        onClick: () =>  navigate( "/yaya")
    },
    { 
      title: "EthioDash", 
      image: "https://via.placeholder.com/100?text=ETHIODASH", 
      onClick: () => alert("EthioDash clicked") 
    },
  
  ];

  return (
    <Box m="20px">
             <Box display="flex" justifyContent="space-between" alignItems="center">
             <Header title="REVENUE" subtitle="Welcome to revenue payment" />
             </Box>
    <Grid container spacing={2}  >
      {menuItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            onClick={item.onClick}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              textAlign: "center",
              boxShadow: 3,
              borderRadius: 2,
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              backgroundColor:colors.primary[400]
               // Hover effect
            }}
          >
            <Box
              component="img"              
              src={item.image }
              alt={item.title}
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                marginBottom: 2,
                objectFit: "cover"
              }}
            />
            <CardContent>
              <Typography variant="h6">{item.title}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  );
}
