import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa"; // Import icons

const ListPeminjaman = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

            // Fetch data peminjaman (borrowing)
            const borrowingResponse = await axios.get(
              `http://localhost:3000/borrowing`
            );
            const borrowingData = borrowingResponse.data;

            // Fetch data student
            const studentResponse = await axios.get(
              `http://localhost:3000/student?adminId=${adminId}`
            );
            const studentData = studentResponse.data;

            // Fetch data buku
            const booksResponse = await axios.get(
              `http://localhost:3000/books`
            );
            const booksData = booksResponse.data;

            // Filter hanya student yang ada di tabel borrowing
            const studentDetails = await Promise.all(
              borrowingData.map(async (borrow) => {
                const student = studentData.find(
                  (student) => student.id === borrow.studentId
                );

                if (student) {
                  const userResponse = await axios.get(
                    `http://localhost:3000/users/${student.userId}`
                  );

                  // Ambil judul buku yang dipinjam
                  const book = booksData.find(
                    (book) => book.kodeBuku === borrow.kodeBuku
                  );

                  return {
                    ...student,
                    name: userResponse.data.name,
                    borrowedBookTitle: book
                      ? book.title
                      : "Buku tidak ditemukan",
                    nomorHp: borrow.nomorHp,
                    tanggalPeminjaman: borrow.tanggalPeminjaman,
                    tanggalPengembalian: borrow.tanggalPengembalian,
                    status: borrow.status, // Status dari tabel borrowing
                  };
                }
                return null;
              })
            );

            // Hapus student yang tidak memiliki borrowing
            const filteredStudents = studentDetails.filter(
              (student) => student !== null
            );

            setStudents(filteredStudents);
            setFilteredStudents(filteredStudents); // Set initial filtered students
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

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter daftar siswa berdasarkan query pencarian
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  return (
    <div className="max-w-6xl min-h-screen p-6 mx-auto rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Daftar Peminjaman Buku</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nama</th>
              <th className="px-4 py-2 border-b">Kelas</th>
              <th className="px-4 py-2 border-b">Nomor HP</th>
              <th className="px-4 py-2 border-b">Tanggal Peminjaman</th>
              <th className="px-4 py-2 border-b">Tanggal Pengembalian</th>
              <th className="px-4 py-2 border-b">Judul Buku</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Foto</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-2 text-center border-b">
                    {student.name}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {student.class}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {student.nomorHp}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {student.tanggalPeminjaman}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {student.tanggalPengembalian}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {student.borrowedBookTitle}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {student.status === "1" ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <img
                      src={student.prifilImage}
                      alt={student.name}
                      className="object-cover w-12 h-12 mx-auto rounded-full"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center border-b">
                  Tidak ada peminjaman buku.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPeminjaman;
