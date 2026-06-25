# Sistem Pengaduan Sekolah

Aplikasi web fullstack untuk mengelola pengaduan siswa di sekolah, dibangun menggunakan React.js, Node.js, Express.js, dan MongoDB Atlas.

## Tim Pengembang

| Nama                            | NIM      | Role                |
| ------------------------------- | -------- | ------------------- |
| Muhammad Rifki Iskandar Bachrie | 11240003 | Fullstack Developer |
| Muhammad Rama Anshor            | 11240034 | Frontend Developer  |

## Fitur

- Login & Register (JWT Authentication)
- Input Pengaduan dengan Kategori
- Dashboard Laporan (Admin & Siswa)
- Search & Filter Pengaduan
- Tracking Status Pengaduan
- Edit & Hapus Pengaduan
- Responsive Design

## Teknologi

### Frontend

- React.js + Vite
- Tailwind CSS v3
- React Router DOM
- Axios
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT (JSON Web Token)
- Bcryptjs

## Struktur Project

pengaduan-sekolah/
├── frontend/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── hooks/
│ ├── layouts/
│ └── utils/
└── backend/
├── controllers/
├── models/
├── routes/
├── middleware/
└── utils/

## Cara Menjalankan

### Backend

```bash
cd backend
npm install
cp .env.example .env  # isi MONGO_URI dan JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint                       | Deskripsi             | Auth   |
| ------ | ------------------------------ | --------------------- | ------ |
| POST   | /api/auth/register             | Daftar akun           | Public |
| POST   | /api/auth/login                | Login                 | Public |
| GET    | /api/pengaduan                 | Ambil semua pengaduan | Login  |
| GET    | /api/pengaduan/:id             | Detail pengaduan      | Login  |
| POST   | /api/pengaduan                 | Buat pengaduan        | Login  |
| PUT    | /api/pengaduan/:id             | Update pengaduan      | Login  |
| DELETE | /api/pengaduan/:id             | Hapus pengaduan       | Login  |
| GET    | /api/pengaduan/dashboard/stats | Statistik             | Admin  |

## Role

| Role      | Hak Akses                                                   |
| --------- | ----------------------------------------------------------- |
| **Siswa** | Buat, lihat, edit, hapus pengaduan sendiri (status pending) |
| **Admin** | Kelola semua pengaduan, ubah status, lihat dashboard global |
| **Guru**  | Kelola semua pengaduan, ubah status, lihat dashboard global |
