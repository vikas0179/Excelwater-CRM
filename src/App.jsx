import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/auth//login";
import ForgotPass from "./pages/auth/forgot-password";
import ResetPass from "./pages/auth/reset-password";
import ChangePassword from "./pages/auth/ChangePassword";
import Profile from "./pages/auth/profile";
import Logout from "./pages/auth/logout";
import UserAdd from "./pages/user/UserAdd";
import UserEdit from "./pages/user/UserEdit";
import { ToastContainer } from "react-toastify";
import User from "./pages/user/User";
import ScrollToTop from "./components/ScrollToTop";
import Error from "./pages/404";
import { ManagesSupplier } from "./pages/suppliermaster/ManagesSupplier";
import { AddSupplier } from "./pages/suppliermaster/AddSupplier";
import { ManageProduct } from "./pages/productmaster/ManageProduct";
import { AddProduct } from "./pages/productmaster/AddProduct";
import { ManageSpareparts } from "./pages/spareparts/ManageSpareparts";
import { AddSpareParts } from "./pages/spareparts/AddSpareparts";
import { ManageOrder } from "./pages/Order/ManageOrder";
import { AddOrder } from "./pages/Order/AddOrder";
import { ManageInvoice } from "./pages/invoice/ManageInvoice";
import { AddInvoice } from "./pages/invoice/AddInvoice";
import InvoicePdf from "./pages/invoice/InvoicePdf";
import PublicInvoice from "./pages/invoice/PublicInvoice";
import ManageCustomer from "./pages/Customer/ManageCustomer";
import { AddCustomer } from "./pages/Customer/AddCustomer";
import { AlertMaterialReport } from "./pages/AlertMaterialReport/AlertMaterialReport";

function App() {
  return (
    <main className="App  relative">
      <Routes>
        {/* <Route path="/" element={<AuthLayout />}> */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />

        <Route path="/manage_invoice/invoice_detail/:invoiceNo" element={<PublicInvoice />} />

        {/* </Route> */}
        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="manage-users" element={<User />} />
          <Route path="manage-users/add" element={<UserAdd />} />
          <Route path="manage-users/edit/:id" element={<UserEdit />} />

          {/* <Route path="manage-leads" element={<ManageLead />} />
          <Route path="manage-leads/add" element={<AddLead />} />
          <Route path="manage-leads/edit/:id" element={<EditLead />} />
          <Route path="sales-leads" element={<SalesLeads />} />
          <Route path="transfer-leads" element={<TransferLeads />} />
          <Route path="revenue-report" element={<RevenueReport />} />
          <Route path="lead-statistics" element={<LeadStatistics />} />
          <Route path="duplicate-leads" element={<DuplicateLead />} />
          <Route path="manage-sales-channel" element={<SaleChannel />} /> */}

          <Route path="manage-supplier" element={<ManagesSupplier />} />
          <Route path="manage-supplier/add/:id" element={<AddSupplier />} />
          <Route path="manage-supplier/add" element={<AddSupplier />} />

          <Route path="manage-product" element={<ManageProduct />} />
          <Route path="manage-product/add" element={<AddProduct />} />
          <Route path="manage-product/add/:id" element={<AddProduct />} />

          <Route path="manage-sparepart" element={<ManageSpareparts />} />
          <Route path="manage-sparepart/add" element={<AddSpareParts />} />
          <Route path="manage-sparepart/add/:id" element={<AddSpareParts />} />

          <Route path="manage-order" element={<ManageOrder />} />
          <Route path="manage-order/add" element={<AddOrder />} />
          <Route path="manage-order/add/:id" element={<AddOrder />} />

          <Route path="manage-invoice" element={<ManageInvoice />} />
          <Route path="manage-invoice/add" element={<AddInvoice />} />
          <Route path="manage-invoice/add/:id" element={<AddInvoice />} />
          <Route path="manage-invoice/invoice/:id" element={<InvoicePdf />} />

          <Route path="manage-customer" element={<ManageCustomer />} />
          <Route path="manage-customer/add" element={<AddCustomer />} />
          <Route path="manage-customer/add/:id" element={<AddCustomer />} />

          <Route path="manage-report" element={<AlertMaterialReport />} />

          <Route path="*" element={<Error />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
      <ToastContainer />
      <ScrollToTop />
    </main>
  );
}

export default App;
