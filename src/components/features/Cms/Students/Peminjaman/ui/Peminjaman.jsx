import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie untuk mengambil data dari token
import Select from "react-select"; // Import react-select untuk dropdown dengan fitur pencarian

const PeminjamanForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    noTelepon: "",
    kodeBuku: "",
    judulBuku: "",
    tanggalPeminjaman: "",
    tanggalPengembalian: "",
  });

  const [bookOptions, setBookOptions] = useState([]); // State untuk menyimpan daftar buku

  useEffect(() => {
    // Fetch daftar buku dari JSON Server
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/books");
        const books = response.data.map((book) => ({
          value: book.kodeBuku, // Kode buku sebagai value
          label: book.title, // Judul buku sebagai label
        }));
        setBookOptions(books);
      } catch (error) {
        console.error("Error fetching books data:", error);
      }
    };

    // Fetch data user dari cookie token dan populate ke form
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          // Decode token untuk mendapatkan ID user (ini contoh sederhana, mungkin menggunakan jwt-decode)
          const decoded = JSON.parse(atob(token.split(".")[1])); // Mengambil payload dari token (dalam JSON)
          const userId = decoded.id;

          // Fetch user data berdasarkan ID
          const response = await axios.get(
            `http://localhost:3000/users/${userId}`
          );
          const userData = response.data;

          // Isi nama dan nomor telepon dari user yang login
          setFormData((prevData) => ({
            ...prevData,
            id: userId,
            nama: userData.name, // Mengisi nama otomatis
            noTelepon: userData.noTelepon || "", // Optional, tergantung apakah field ini ada di users
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchBooks();
    fetchUserData();

    // Mengisi tanggal peminjaman dengan tanggal saat ini
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setFormData((prevData) => ({
      ...prevData,
      tanggalPeminjaman: currentDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookChange = (selectedOption) => {
    setFormData({
      ...formData,
      kodeBuku: selectedOption.value, // Isi kode buku dari value yang dipilih
      judulBuku: selectedOption.label, // Isi judul buku dari label yang dipilih
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Lakukan POST request ke JSON Server untuk menyimpan data peminjaman
      const borrowingData = {
        userId: formData.id, // ID User yang melakukan peminjaman
        kodeBuku: formData.kodeBuku, // Kode Buku yang dipinjam
        tanggalPeminjaman: formData.tanggalPeminjaman,
        tanggalPengembalian: formData.tanggalPengembalian,
      };

      await axios.post("http://localhost:3000/borrowing", borrowingData);

      console.log("Data peminjaman berhasil disimpan:", borrowingData);

      // Reset form setelah submit
      setFormData({
        id: "",
        nama: "",
        noTelepon: "",
        kodeBuku: "",
        judulBuku: "",
        tanggalPeminjaman: "",
        tanggalPengembalian: "",
      });

      alert("Peminjaman berhasil disimpan!");
    } catch (error) {
      console.error("Error menyimpan peminjaman:", error);
      alert("Terjadi kesalahan saat menyimpan peminjaman.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl p-6 bg-slate-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Peminjaman Buku Perpustakaan SMPN 11 Pontianak
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Anggota */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Anggota
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 text-slate-900 bg-slate-50 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan ID Anggota"
                readOnly // Tidak bisa diubah, karena otomatis diambil dari token
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 text-slate-900 bg-slate-50 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama Otomatis Terisi"
                readOnly // Kolom ini hanya baca saja
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                No. Telepon
              </label>
              <input
                type="text"
                name="noTelepon"
                value={formData.noTelepon}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 text-slate-900 bg-slate-50 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan No. Telepon"
                required
              />
            </div>
          </div>

          {/* Informasi Buku */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Judul Buku
              </label>
              <Select
                options={bookOptions}
                onChange={handleBookChange}
                placeholder="Pilih Judul Buku"
                className="mt-1 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kode Buku
              </label>
              <input
                type="text"
                name="kodeBuku"
                value={formData.kodeBuku}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 text-slate-900 bg-slate-50 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kode Buku Otomatis Terisi"
                readOnly // Kolom ini hanya baca saja
              />
            </div>
          </div>

          {/* Tanggal Peminjaman dan Pengembalian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Peminjaman
              </label>
              <input
                type="date"
                name="tanggalPeminjaman"
                value={formData.tanggalPeminjaman}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 text-slate-900 bg-slate-50 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                readOnly // Tanggal ini otomatis diisi dengan tanggal saat ini
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Pengembalian
              </label>
              <input
                type="date"
                name="tanggalPengembalian"
                value={formData.tanggalPengembalian}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 text-slate-900 bg-slate-50 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Submit Peminjaman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeminjamanForm;
