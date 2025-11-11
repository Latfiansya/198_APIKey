// server.js
const express = require('express');
const path = require('path');
const crypto = require('crypto'); // untuk membuat API key random
const app = express();

const PORT = 3000;

// Middleware untuk melayani file statis dari folder "public"
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // agar bisa menerima JSON dari frontend

// Route root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🧠 Route untuk membuat API key baru
app.post('/create', (req, res) => {
  try {
    // buat key acak, mirip format openai key
    const randomKey = 'sk-' + crypto.randomBytes(24).toString('base64url'); // hasil unik
    res.status(200).json({
      success: true,
      apiKey: randomKey,
      message: 'API key berhasil digenerate!'
    });
  } catch (err) {
    console.error('Gagal generate API key:', err);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat API key.'
    });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
