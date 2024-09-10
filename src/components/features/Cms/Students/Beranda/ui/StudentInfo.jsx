import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const StudentInfo = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    class: "",
    borrowedBooks: 0,
    activeStatus: "",
    lastBorrowedDate: "",
  });

  useEffect(() => {
    // Ambil token dari cookie
    const token = Cookies.get("token");

    if (token) {
      try {
        // Decode token untuk mendapatkan payload
        const decoded = jwtDecode(token);

        // Dapatkan id dari token yang sudah di-decode
        const userId = decoded.id;

        // Fetch data siswa berdasarkan ID dari token
        const fetchStudentData = async () => {
          try {
            // Pertama, ambil data dari tabel users untuk mendapatkan nama
            const userResponse = await axios.get(
              `http://localhost:3000/users/${userId}`
            );
            const userData = userResponse.data;

            // Kedua, ambil data dari tabel students untuk mendapatkan info lainnya
            const studentResponse = await axios.get(
              `http://localhost:3000/student/${userId}`
            );
            const studentData = studentResponse.data;

            // Menghitung status keaktifan berdasarkan jumlah buku yang dipinjam
            const activeStatus =
              studentData.borrowedBooks > 5
                ? "Siswa Aktif"
                : studentData.borrowedBooks > 0
                ? "Siswa Sedang Aktif"
                : "Siswa Tidak Aktif";

            // Set data ke state
            setStudentData({
              name: userData.name, // Dapatkan nama dari userData
              class: studentData.class,
              borrowedBooks: studentData.borrowedBooks,
              activeStatus: activeStatus,
              lastBorrowedDate: studentData.lastBorrowedDate,
            });
          } catch (error) {
            console.error("Error fetching student data:", error);
          }
        };

        fetchStudentData();
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      console.error("Token not found");
    }
  }, []);

  return (
    <div className="p-6 border border-slate-950 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Info Siswa</h2>
      <div className="mb-4">
        <span className="font-semibold">Nama: </span>
        <span>{studentData.name}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Kelas: </span>
        <span>{studentData.class}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Jumlah Buku yang Dipinjam: </span>
        <span>{studentData.borrowedBooks}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Status Keaktifan: </span>
        <span>{studentData.activeStatus}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Terakhir Meminjam Buku Pada: </span>
        <span>{studentData.lastBorrowedDate}</span>
      </div>
    </div>
  );
};

export default StudentInfo;
