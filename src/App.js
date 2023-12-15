import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Payment from "./components/Payment";
import Profile from "./components/Profile";
import TransactionHistory from "./components/TransactionHistory";
import Receipt from "./components/Receipt";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";

function App() {
  return (
    <div>
          <UserAuthContextProvider>
            <Routes>
              {/* <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              /> */}

              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/Receipt"
                element={
                  <ProtectedRoute>
                    <Receipt />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/TransactionHistory"
                element={
                  <ProtectedRoute>
                    <TransactionHistory />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Payment />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="/home" element={<Home />} /> */}
            </Routes>
          </UserAuthContextProvider>
        </div>
  );
}

export default App;