import { useEffect, useState } from "react";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { getUser } from "./services/userServices";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Team from "./pages/team";
import Invoices from "./pages/invoices";
import Contacts from "./pages/contacts";
import Bar from "./pages/bar";
import Form from "./pages/form";
import Line from "./pages/line";
import Pie from "./pages/pie";
import FAQ from "./pages/faq";
import Login from "./pages/login";
import Geography from "./pages/geography";
import Calendar from "./pages/calendar/calendar";
import Logout from "./components/logout";



function App() {

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [user, setUser] = useState(null)


  useEffect(() => {
    try {
      const session = getUser();
      setUser(session)
    } catch (err) {
      console.log(err)
    }
  }, []);



  return (

    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {user ? (
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </main>
          </div>
        ) :
          <Login />
        }
      </ThemeProvider>
    </ColorModeContext.Provider>

  );
}

export default App;
