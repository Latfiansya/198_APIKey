// server.js
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const PORT = 3000;

// --- Inisialisasi Database SQLite ---
const db = new sqlite3.Database('./apikeys.db', (err) => {
  if (err) console.error('Gagal konek database:', err);
  else console.log('✅ Terkoneksi ke database SQLite.');
});

// Buat tabel kalau belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- Middleware ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- Routes ---

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🧠 Route untuk membuat API key baru & simpan ke DB
app.post('/create', (req, res) => {
  try {
    const randomKey = 'sk-' + crypto.randomBytes(24).toString('base64url');

    // Simpan ke database
    db.run(`INSERT INTO api_keys (key) VALUES (?)`, [randomKey], (err) => {
      if (err) {
        console.error('Gagal menyimpan ke database:', err);
        return res.status(500).json({
          success: false,
          message: 'Gagal menyimpan API key ke database.'
        });
      }

      res.status(200).json({
        success: true,
        apiKey: randomKey,
        message: 'API key berhasil digenerate dan disimpan ke database!'
      });
    });
  } catch (err) {
    console.error('Error saat generate:', err);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat API key.'
    });
  }
});

// ✅ Route untuk cek API key di database
app.post('/cekapi', (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      message: 'API key belum dikirim dalam body request.'
    });
  }

  db.get(`SELECT * FROM api_keys WHERE key = ?`, [apiKey], (err, row) => {
    if (err) {
      console.error('Gagal cek database:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat cek database.'
      });
    }

    if (row) {
      res.status(200).json({ success: true, message: 'API key valid.' });
    } else {
      res.status(401).json({ success: false, message: 'API key tidak valid.' });
    }
  });
});

// --- Jalankan server ---
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
