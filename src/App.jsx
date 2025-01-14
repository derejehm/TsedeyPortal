import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from "./pages/dashboard";
// import Team from "./pages/team";
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
import Sekela from "./pages/sekela/Sekela";
import RevenueHome from "./components/revenue/RevenueHome";
import BillIdForm from "./components/yaya/BillIdForm";
import PaymentSupervision from "./pages/supervision/Supervision";
import PaymentReport from "./pages/report/PaymentReport";
import NotFoundPage from "./pages/errorPage/NotFoundPage ";
import RootLayout from "./pages/Root.js";
import { getSession } from "./services/userServices.js";
import { logout as logoutAction } from "./services/userServices.js";




const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    id: 'root',
    loader: getSession,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "revenue", element: <RevenueHome /> },
      { path: "contacts", element: <Contacts /> },
      { path: "invoices", element: <Invoices /> },
      { path: "form", element: <Form /> },
      { path: "bar", element: <Bar /> },
      { path: "pie", element: <Pie /> },
      { path: "line", element: <Line /> },
      { path: "faq", element: <FAQ /> },
      { path: "calendar", element: <Calendar /> },
      { path: "geography", element: <Geography /> },
      { path: "logout", action: logoutAction },
      { path: "sekela", element: <Sekela /> },
      { path: "yaya", element: <BillIdForm /> },
      { path: "paymentsupervision", element: <PaymentSupervision /> },
      { path: "paymentreport", element: <PaymentReport /> },
      // 404 Catch-All Route
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )


}

export default App;
