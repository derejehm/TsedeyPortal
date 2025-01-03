import React from "react";
import { Card, CardContent, Typography, Grid,useTheme,Box } from "@mui/material";
import { Home, Settings, Info, ContactMail, } from "@mui/icons-material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import  sekelaLogo from "../../assets/images/sekela.png";

export default function RevenueHome() {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

   // Array of menu items with title and image URL
  const menuItems = [
    { 
      title: "SEKELA", 
      image:"https://via.placeholder.com/100?text=SEKELA",
      onClick: () =>  window.location = "/sekela"
    },
    { 
      title: "YAYA", 
      image: "https://via.placeholder.com/100?text=YAYA", 
        onClick: () =>  window.location = "/yaya"
    },
    { 
      title: "About Us", 
      image: "https://via.placeholder.com/100?text=ETHIODASH", 
      onClick: () => alert("About Us clicked") 
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
              src={item.image}
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

