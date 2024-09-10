import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode untuk mendecode token

const KartuAnggota = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    className: "",
    memberId: "",
    profilImage: "",
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
            // Ambil data user (untuk nama dan id member)
            const userResponse = await axios.get(
              `http://localhost:3000/users/${userId}`
            );

            // Ambil data student (untuk kelas dan info tambahan)
            const studentResponse = await axios.get(
              `http://localhost:3000/student/${userId}`
            );

            const userData = userResponse.data;
            const studentData = studentResponse.data;

            // Set state dengan data dari server
            setStudentData({
              name: userData.name,
              className: studentData.class,
              memberId: `SMPN11-${userData.id}`,
              profilImage: studentData.prifilImage, // Tambahkan gambar profil
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
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 hover:shadow-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
      {/* Header */}
      <div className="bg-blue-500 p-4 text-center">
        <h1 className="text-3xl text-white font-bold">Kartu Anggota</h1>
      </div>

      {/* Body */}
      <div className="flex items-center p-6">
        {/* Foto Profil */}
        <img
          src={studentData.profilImage}
          alt="Foto Profil"
          className="w-32 h-32 rounded-full mr-6 border-4 border-blue-500 shadow-md"
        />

        {/* Informasi Siswa */}
        <div>
          {/* Nama */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-semibold">Nama</p>
            <p className="text-2xl text-gray-900 font-bold">
              {studentData.name}
            </p>
          </div>

          {/* Kelas */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-semibold">Kelas</p>
            <p className="text-lg text-gray-900 font-bold">
              {studentData.className}
            </p>
          </div>

          {/* Nomor Anggota */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-semibold">Nomor Anggota</p>
            <p className="text-lg text-gray-900 font-bold">
              {studentData.memberId}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-sm text-gray-500">Perpustakaan SMPN 11 Pontianak</p>
      </div>
    </div>
  );
};

export default KartuAnggota;
