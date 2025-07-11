import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useLocation, Navigate, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import ConnectionStatus from "./components/ConnectionStatus";
import LoadingAnimation from "./components/LoadingAnimation";
import { LoginForm } from "./components/LoginForm";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import Dashboard from "./scenes/dashboard/dashboard";
// import Profile from "./scenes/profile/Profile";
import Copilot from "./scenes/copilot/copilot";
import Sidebar from "./scenes/global/sidebar";
import Profile from "./scenes/profile/profile";
import Transactions from "./scenes/transactions/transactions";
import Budget from "./scenes/budget/budget";
import Subscription from "./scenes/subscription/subscription";
import Invesment from "./scenes/invesment/invesment";

function AppContent() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingAnimation />;
  }

  // Eğer kullanıcı giriş yapmamışsa ve login sayfasında değilse, login sayfasına yönlendir
  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  // Eğer kullanıcı giriş yapmışsa ve login sayfasındaysa, ana sayfaya yönlendir
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  const LoginRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    );
  };

  const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="copilot" element={<Copilot />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/investments" element={<Invesment />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConnectionStatus />
        <div className="app" style={{ display: "flex", minHeight: "100vh" }}>
          {isAuthenticated && <Sidebar />}
          <div style={{ flex: 1 }}>
            {loading ? (
              <LoadingAnimation />
            ) : !isAuthenticated ? (
              <LoginRoutes />
            ) : (
              <AppRoutes />
            )}
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function App() {
  return (
    <WebSocketProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
    </WebSocketProvider>
  );
}

export default App;
