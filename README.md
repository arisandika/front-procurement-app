# Procurement App (Frontend)

Frontend aplikasi manajemen procurement berbasis **HTML, TailwindCSS, jQuery, dan JavaScript**.  
Mendukung fitur CRUD master data, purchasing dengan cart, dan dashboard summary.

---

## Dependencies / Tools

- [TailwindCSS](https://tailwindcss.com/) (via CDN atau build)
- [jQuery](https://jquery.com/) (via CDN)
- [SweetAlert2](https://sweetalert2.github.io/) (via CDN)
- Browser modern (Chrome / Edge / Firefox)
- Backend Fiber Go sudah berjalan di **http://localhost:3000**

> Tidak perlu npm / build tools untuk versi vanilla HTML + Tailwind + jQuery ini.

---

## Setup 

1. **Clone repository**

git clone https://github.com/arisandika/front-procurement-app.git

`cd frontend-procurement-app`

2. **Pastikan backend sudah berjalan** di http://localhost:3000

3. **Buka file `index.html`** di browser  
   - Semua halaman (Dashboard, Supplier, Item, Purchasing) sudah bisa diakses.  
   - CRUD & purchasing menggunakan **AJAX** ke backend API.  
   - Cart menggunakan **localStorage** dan mendukung multi-tab sync.

---

## Fitur

- **CRUD Master Data**
  - Supplier
  - Item
- **Purchasing**
  - Tambah ke keranjang (cart)
  - Submit order sekaligus
  - Validasi supplier sama
  - Alert jika beda supplier
  - Multi-tab sync & localStorage
- **Dashboard**
  - Summary total per supplier, per item, dan transaksi
- **Invoice / Detail purchasing**
  - Modal detail
  - Cetak invoice HTML

---

## ✅ Notes

- Semua operasi frontend menggunakan **AJAX** ke backend API: http://localhost:3000/api/...  
- Cart disimpan di **localStorage**, sehingga tetap ada walau pindah halaman.  
- Multi-tab sync aktif, perubahan cart di tab lain otomatis tersinkron.  
- Pastikan backend berjalan sebelum membuka frontend agar CRUD & purchasing berfungsi.
