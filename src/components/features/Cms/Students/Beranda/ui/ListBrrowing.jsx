import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Untuk mengambil token dari cookie

const ListBorrowing = () => {
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    // Fungsi untuk mengambil data peminjaman berdasarkan user yang sedang login
    const fetchBorrowings = async () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          // Decode token untuk mendapatkan ID user
          const decoded = JSON.parse(atob(token.split(".")[1])); // Contoh sederhana mengambil payload dari token
          const userId = decoded.id;

          // Ambil data dari tabel borrowing berdasarkan userId
          const response = await axios.get(
            `http://localhost:3000/borrowing?userId=${userId}`
          );

          setBorrowings(response.data);
        } catch (error) {
          console.error("Error fetching borrowings:", error);
        }
      } else {
        console.error("Token not found");
      }
    };

    fetchBorrowings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6  rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Daftar Buku yang Dipinjam</h2>

      {borrowings.length === 0 ? (
        <p className="text-gray-500">Tidak ada buku yang sedang dipinjam.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowings.map((borrow) => (
            <div
              key={borrow.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-2">
                ID Peminjaman: {borrow.id}
              </h3>
              <p className="text-sm mb-1">
                <strong>Kode Buku:</strong> {borrow.kodeBuku}
              </p>
              <p className="text-sm mb-1">
                <strong>Tanggal Peminjaman:</strong> {borrow.tanggalPeminjaman}
              </p>
              <p className="text-sm mb-1">
                <strong>Tanggal Pengembalian:</strong>{" "}
                {borrow.tanggalPengembalian}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListBorrowing;
