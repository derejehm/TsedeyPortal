import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Topbar from "./global/Topbar";
import Sidebar from "./global/Sidebar";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { ColorModeContext, useMode } from "../theme";

import Login from "./login";
import { getSessionDuration } from "../services/userServices";

function RootLayout() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const session = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!session) {
      return;
    }

    if (session === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' })
      return;
    }

    const sessionDuration = getSessionDuration();
    

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' })
    }, sessionDuration);

  }, [session, submit]);

  return <>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {session ? (
          <Box className="app" alignContent="flex">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Outlet />
            </main>
          </Box>
        ) :
          <Login />
        }
      </ThemeProvider>
    </ColorModeContext.Provider>
  </>
}

export default RootLayout;