# TrashValue ♻️

**TrashValue** adalah aplikasi manajemen sampah digital berbasis React Native dan [Expo](https://expo.dev) yang menghubungkan pengguna dengan bank sampah. Aplikasi ini memudahkan pengguna untuk menyetorkan sampah, mendapatkan imbalan berupa uang tunai atau poin digital, serta menyediakan fitur edukasi dan konsultasi pengelolaan sampah melalui chat AI berbasis Gemini.

---

## Fitur Utama

- **Setor Sampah Digital:** Pengguna dapat membuat permintaan dropoff, memilih jenis sampah, menentukan metode pengambilan (dijemput/antar sendiri), dan melacak status dropoff.
- **Imbalan Tunai & Poin:** Setiap dropoff yang berhasil diproses akan menambah saldo tunai atau poin digital pengguna.
- **Riwayat Transaksi & Dropoff:** Pantau seluruh aktivitas dropoff dan transaksi keuangan secara transparan.
- **Top Up & Penarikan Saldo:** Pengguna dapat melakukan top up saldo dan penarikan dana ke rekening bank.
- **Edukasi & Konsultasi AI:** Fitur chat AI berbasis Gemini untuk edukasi, tanya jawab, dan konsultasi seputar pengelolaan sampah.
- **Profil & Pengaturan Akun:** Edit profil, unggah foto, dan kelola data pribadi.
- **Notifikasi:** Mendapatkan update status dropoff, transaksi, dan edukasi terbaru.

---

## Instalasi & Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/username/trashvalue-app.git
cd trashvalue-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Aplikasi

```bash
npx expo start
```

Aplikasi dapat dijalankan di:

- [Expo Go](https://expo.dev/go) (Android/iOS)
- Android Emulator
- iOS Simulator
- Development Build

---

## Struktur Direktori

```
trash4cash/
├── app/                # File-based routing (halaman utama, login, signup, dsb)
├── components/         # Komponen UI (DropoffList, WasteTypeCard, Modal, dsb)
├── features/           # Redux store & slices
├── hooks/              # Custom hooks (data fetching, mutation, dsb)
├── types/              # TypeScript types & interfaces
├── constants/          # Konstanta global (images, colors, dsb)
├── assets/             # Gambar, ikon, font
├── README.md           # Dokumentasi ini
└── ...
```

---

## Penjelasan Fitur

### 1. **Dropoff Sampah**

- Pilih jenis sampah yang ingin disetorkan.
- Tentukan metode pengambilan: **Dijemput** (oleh petugas) atau **Antar Sendiri** ke bank sampah.
- Atur jadwal dan alamat pengambilan.
- Tambahkan catatan atau foto sampah (opsional).
- Lacak status dropoff: Pending, Diproses, Selesai.

### 2. **Imbalan & Transaksi**

- Setiap dropoff yang selesai akan menambah saldo tunai/poin.
- Cek riwayat transaksi dan detail dropoff.
- Fitur **Top Up** dan **Penarikan** saldo ke rekening bank.

### 3. **Edukasi & Chat AI**

- Konsultasi dan edukasi pengelolaan sampah melalui chat AI Gemini.
- Tanya seputar jenis sampah, cara daur ulang, tips ramah lingkungan, dsb.

### 4. **Profil Pengguna**

- Edit data diri, foto profil, dan pengaturan akun.
- Logout dan keamanan akun.

---

## Teknologi yang Digunakan

- **React Native** & **Expo**: Pengembangan aplikasi mobile lintas platform.
- **TypeScript**: Tipe data statis untuk keamanan dan skalabilitas kode.
- **Redux Toolkit**: Manajemen state global.
- **React Navigation / Expo Router**: Navigasi berbasis file.
- **date-fns**: Manipulasi tanggal.
- **@expo/vector-icons**: Ikon aplikasi.
- **Expo Secure Store**: Penyimpanan token aman.
- **AI Gemini API**: Chat edukasi berbasis AI.
- **Custom Hooks**: Pengambilan dan mutasi data (React Query/RTK Query).

---

## Konfigurasi Environment

Buat file `.env` di root project untuk menyimpan variabel environment, misal:

```
EXPO_PUBLIC_API_URL=https://trashvalue-api.vercel.app/api/v1
EXPO_MIDTRANS_CLIENT_KEY=SB-Mid-client-BtWr-N86OkdW2Qfn
GEMINI_API_KEY=your_gemini_api_key
```

---

## Pengembangan & Kontribusi

1. Fork repository ini.
2. Buat branch fitur: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -m "Tambah fitur baru"`
4. Push ke branch: `git push origin fitur-baru`
5. Buat Pull Request ke repository utama.

---

## Troubleshooting

- **Masalah dependency:** Jalankan `npm install` ulang.
- **Masalah cache:** Jalankan `npx expo start -c`.
- **Masalah emulator:** Pastikan Android Studio/iOS Simulator sudah terinstall.

---

## Lisensi

MIT License © 2025 TrashValue Team

---

## 👨‍💻 Kontributor

- [Rafly Aziz Abdillah](https://github.com/raflytch)
- [Muhammad Haikal Bintang](https://github.com/Haikal18)
- [Jovan Vian Thendra](https://github.com/JovanVian13)
- [Muhammad Satya Rizky Saputra](https://github.com/SatyaRizkySaputra0214)
- [Ahmad Santoso](https://github.com/ahmad-santoso)

---

Selamat berkontribusi untuk lingkungan yang lebih baik bersama TrashValue! 🌱
