import AdminSidebar from "@components/features/Cms/Admin/common/student-sidebar";
import AnggotaPage from "@pages/Cms/admin/Anggota";
import PengunjungPage from "@pages/Cms/admin/Pengunjung";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Admin = () => {
  return (
    <AdminSidebar>
      <Routes>
        <Route path="/" element={<AnggotaPage />} />
        <Route path="/pengunjung" element={<PengunjungPage />} />
      </Routes>
    </AdminSidebar>
  );
};

export default Admin;
