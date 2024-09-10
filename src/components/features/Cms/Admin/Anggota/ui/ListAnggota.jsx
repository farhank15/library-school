import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const ListAnggota = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Ambil token dari cookie
        const token = Cookies.get("token");

        if (token) {
          // Decode token untuk mendapatkan informasi user
          const decoded = jwtDecode(token);
          const userId = decoded.id;
          const role = decoded.role;

          // Cek apakah role adalah admin
          if (role === "admin") {
            // Fetch data admin berdasarkan userId
            const adminResponse = await axios.get(
              `http://localhost:3000/admin?userId=${userId}`
            );
            const adminData = adminResponse.data[0];

            if (!adminData) {
              throw new Error("Admin not found");
            }

            const adminId = adminData.id; // Dapatkan adminId dari tabel admin

            // Fetch data student berdasarkan adminId
            const studentResponse = await axios.get(
              `http://localhost:3000/student?adminId=${adminId}`
            );
            const studentData = studentResponse.data;

            // Fetch data peminjaman (borrowing)
            const borrowingResponse = await axios.get(
              `http://localhost:3000/borrowing`
            );
            const borrowingData = borrowingResponse.data;

            // Proses data siswa dan tambahkan jumlah buku yang dipinjam
            const studentDetails = await Promise.all(
              studentData.map(async (student) => {
                const userResponse = await axios.get(
                  `http://localhost:3000/users/${student.userId}`
                );

                // Hitung jumlah buku yang dipinjam berdasarkan studentId
                const borrowedBooksCount = borrowingData.filter(
                  (borrow) => borrow.studentId === student.id
                ).length;

                return {
                  ...student,
                  name: userResponse.data.name, // Ambil nama dari users table
                  borrowedBooks: borrowedBooksCount || 0, // Jika tidak ada pinjaman, setel ke 0
                };
              })
            );

            setStudents(studentDetails);
          } else {
            setError("You are not authorized to view this page.");
          }
        } else {
          setError("Token not found");
        }
      } catch (error) {
        setError("Error fetching students data");
        console.error("Error fetching students data:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Daftar Anggota</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nama</th>
              <th className="px-4 py-2 border-b">Kelas</th>
              <th className="px-4 py-2 border-b">Jumlah Buku yang Dipinjam</th>
              <th className="px-4 py-2 border-b">Foto</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-2 text-center border-b">
                  {student.name}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {student.class}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {student.borrowedBooks}
                </td>
                <td className="px-4 py-2 border-b">
                  <img
                    src={student.prifilImage}
                    alt={student.name}
                    className="object-cover w-12 h-12 mx-auto rounded-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListAnggota;
