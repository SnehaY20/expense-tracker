import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/login";

// Step 1: Create a query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router> 
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
