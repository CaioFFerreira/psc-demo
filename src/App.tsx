// React core
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// User context
import { UserStorage } from "./contexts/UserContext";

// Pages
import Home from "./pages/Home";
import Dealership from "./pages/Dealership";
import OrderStatus from "./pages/OrderStatus";
import MyOrders from "./pages/MyOrders";
import Users from "./pages/Users";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./helper/ProtectedRoute";
import styled from "styled-components";

// Grid Layout
const Grid = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
  }
`;

function App() {
  return (
    <>
      <Router>
        <UserStorage>
          <Grid>
            <Header />
            <main>
              <Routes>
                <Route path="/*" element={<Home />} />
                <Route
                  path="my-orders"
                  element={
                    <ProtectedRoute roles={[0, 1]}>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dealership"
                  element={
                    <ProtectedRoute roles={[0, 1]}>
                      <Dealership />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute roles={[0]}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="order-status/:id"
                  element={
                    <ProtectedRoute roles={[0, 1]}>
                      <OrderStatus />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </Grid>
        </UserStorage>
      </Router>
    </>
  );
}

export default App;
