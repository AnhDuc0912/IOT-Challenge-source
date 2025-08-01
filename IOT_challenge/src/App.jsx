import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShelfInterface from "./components/ShelfInterface";
import ProductPage from "./pages/ProductPage";
import UserPage from "./pages/UserPage";
import ReceiptPage from "./pages/ReceiptPage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layout/MainLayout";
import TaskPage from "./pages/TaskPage";
const apiUrl = import.meta.env.VITE_API_ENDPOINT;

function App() {
  console.log(apiUrl);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<ShelfInterface />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/receipts" element={<ReceiptPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
