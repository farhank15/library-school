import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ListTamu = () => {
  const [guests, setGuests] = useState([]);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        // Ambil token dari cookie dan decode untuk mendapatkan user yang login
        const token = Cookies.get("token");
        const decodedToken = jwtDecode(token);
        const loggedInUserId = decodedToken.id;

        // Ambil data admin berdasarkan userId yang login
        const adminResponse = await axios.get("http://localhost:3000/admin");
        const loggedInAdmin = adminResponse.data.find(
          (admin) => admin.userId === loggedInUserId
        );
        setAdminId(loggedInAdmin.id);

        // Ambil data dari tabel guest, student, dan users
        const guestResponse = await axios.get("http://localhost:3000/guest");
        const guestData = guestResponse.data;

        const studentResponse = await axios.get(
          "http://localhost:3000/student"
        );
        const studentData = studentResponse.data;

        const userResponse = await axios.get("http://localhost:3000/users");
        const userData = userResponse.data;

        // Memetakan data guest dengan nama student, kelas, dan adminId yang sesuai
        const guestsWithDetails = guestData
          .map((guest) => {
            // Temukan student berdasarkan studentId di tabel guest
            const student = studentData.find(
              (student) =>
                student.id === guest.studentId &&
                student.adminId === loggedInAdmin.id
            );

            if (!student) return null;

            // Temukan user berdasarkan userId di tabel student
            const user = userData.find((user) => user.id === student.userId);

            return {
              id: guest.id,
              name: user ? user.name : "Nama tidak ditemukan",
              class: student ? student.class : "Kelas tidak ditemukan",
              tanggalKunjungan: guest.tanggalKunjungan,
            };
          })
          .filter((guest) => guest !== null); // Hapus entri tamu yang tidak ada student-nya

        setGuests(guestsWithDetails);
      } catch (error) {
        console.error("Error fetching guest data:", error);
      }
    };

    fetchGuests();
  }, []);

  return (
    <div className="max-w-4xl min-h-screen p-6 mx-auto rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Daftar Tamu Perpustakaan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nama</th>
              <th className="px-4 py-2 border-b">Kelas</th>
              <th className="px-4 py-2 border-b">Tanggal Kunjungan</th>
            </tr>
          </thead>
          <tbody>
            {guests.length > 0 ? (
              guests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-4 py-2 text-center border-b">
                    {guest.name}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {guest.class}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {guest.tanggalKunjungan}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center border-b">
                  Tidak ada tamu yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListTamu;
