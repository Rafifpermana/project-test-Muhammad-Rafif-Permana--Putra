## 1. Header
Ketentuan untuk komponen header sudah terpenuhi sepenuhnya.

✅ Posisi Fixed & Show/Hide on Scroll: Header memiliki position: fixed di style.css (.header). Logika untuk menyembunyikan header saat scroll ke bawah dan menampilkannya kembali saat scroll ke atas diatur dalam fungsi handleScroll() pada script.js. Fungsi ini menambahkan/menghapus kelas .hidden yang memiliki transform: translateY(-100%);.

✅ Background Transparan: Saat di-scroll lebih dari 100px, fungsi handleScroll() akan menambahkan kelas .scrolled ke header, yang mengubah background-color menjadi sedikit transparan (rgba(255, 107, 53, 0.95)) dan menambahkan efek backdrop-filter: blur(10px).

✅ Active State Menu: Pada index.html, menu "Ideas" sudah memiliki kelas .active (<a href="#ideas" class="active">Ideas</a>), yang kemudian diberi gaya garis bawah oleh CSS (.nav a.active).

## 2. Banner
Ketentuan untuk komponen banner juga sudah terpenuhi.

✅ Gambar & Area Miring: Banner menggunakan background-image pada elemen .banner-bg di style.css, yang memungkinkan gambar diganti dengan mudah. Area miring di bagian bawah dibuat menggunakan elemen terpisah .banner-diagonal dengan properti CSS transform: skewY(-2deg);. Ini adalah pendekatan yang tepat sehingga gambar asli tidak perlu diedit.

✅ Efek Parallax: Efek parallax saat scroll diimplementasikan dalam fungsi handleScroll() di script.js. Kode tersebut mengubah posisi transform dari .banner-bg dan .banner-content dengan kecepatan berbeda, menciptakan ilusi kedalaman.

## 3. List Post
Seluruh ketentuan untuk fungsionalitas daftar post telah diimplementasikan dengan benar.

✅ Fungsi Sort & Show Per Page:

Di index.html, terdapat elemen <select> untuk "Show per page" (#itemsPerPage) dan "Sort by" (#sortBy).

Di script.js, setupEventListeners() menambahkan event listener pada kedua elemen tersebut. Ketika nilainya berubah, ia akan memperbarui properti (this.itemsPerPage atau this.sortBy), mengatur ulang halaman ke 1, lalu memanggil fetchIdeas() untuk mengambil data baru.

Status item (Showing 1 - 10 of 100) diperbarui melalui fungsi updateStatusText().

✅ Pilihan Sort & Jumlah Item: Opsi yang tersedia pada elemen <select> sudah sesuai dengan ketentuan: ['Newest', 'Oldest'] (dengan value -published_at dan published_at) dan [10, 20, 50].

✅ State Tidak Kembali ke Awal (State Persistence): Ini adalah salah satu implementasi terbaik dalam kode ini.

Fungsi loadStateFromURL() dijalankan saat halaman dimuat untuk membaca parameter dari URL (misalnya, ?page=2&size=20&sort=published_at) menggunakan URLSearchParams.

Setiap kali pengguna mengubah filter atau halaman, fungsi updateURL() akan memperbarui URL di browser menggunakan window.history.replaceState() tanpa me-refresh halaman. Dengan cara ini, jika pengguna me-refresh halaman, state terakhir akan tetap terjaga.

✅ Ratio Thumbnail Konsisten: Di style.css, kelas .idea-image memiliki height: 200px dan overflow: hidden. Gambar di dalamnya (img) memiliki object-fit: cover, width: 100%, dan height: 100%, yang memastikan semua thumbnail memiliki rasio dan ukuran yang seragam.

✅ Lazy Loading: Lazy loading pada gambar diimplementasikan dengan sangat baik menggunakan IntersectionObserver. Di script.js, gambar awalnya tidak memiliki src, melainkan data-src. IntersectionObserver akan mengamati setiap gambar, dan hanya ketika gambar masuk ke dalam viewport, src aslinya akan diatur, sehingga gambar baru di-load.

✅ Batas Teks & Ellipsis: Teks judul pada card dibatasi maksimal 3 baris. Di style.css, kelas .idea-title menggunakan properti -webkit-line-clamp: 3; untuk mencapai ini, yang merupakan cara modern dan efektif untuk memotong teks multi-baris dengan ellipsis (...).

## 4. API
Ketentuan terkait interaksi dengan API juga sudah diimplementasikan dengan benar.

✅ Penggunaan API & Parameter: Fungsi fetchIdeas() di script.js membangun URL API secara dinamis sesuai dengan state saat ini (halaman, item per halaman, dan urutan). Format URL dan parameternya sudah sama persis dengan contoh yang diberikan:
https://suitmedia-backend.suitdev.com/api/ideas?page[number]=...&page[size]=...&append[]=small_image&append[]=medium_image&sort=...



## Masalah yang ditemukan:
1. Error API 405 - Method Not Allowed
Permintaan fetch ke API gagal dengan pesan "Backend accept only json communication." Ini disebabkan oleh pengiriman header Content-Type: application/json pada request GET yang tidak memiliki body.Header permintaan diubah dari Content-Type menjadi Accept: application/json. Ini secara benar mengindikasikan bahwa client mengharapkan respons JSON dari server, bukan mengirim data JSON.

2. Gambar Tidak Tampil (Hanya Placeholder "Loading...")
Setelah koneksi API berhasil, data teks muncul tetapi gambar tidak. Ini terjadi karena API mengembalikan URL gambar yang bersifat relatif (contoh: /storage/files/gambar.jpg), bukan absolut.

3. Gambar Gagal Dimuat (Error 403 - Forbidden)
Meskipun URL gambar sudah diperbaiki menjadi absolut, server tetap menolak permintaan dengan error 403 Forbidden.Ini adalah masalah di sisi server, bukan pada kode frontend. Kemungkinan besar server tersebut memiliki proteksi hotlinking yang mencegah domain lain menampilkan gambarnya secara langsung. Untuk melanjutkan pengembangan UI tanpa terblokir, implementasi diubah untuk sementara waktu agar menggunakan gambar placeholder acak dari layanan Picsum Photos. Solusi permanen untuk masalah ini memerlukan perubahan konfigurasi di sisi backend oleh pemilik API.