// server.js
const express = require('express');
const path = require('path');
const app = express();

// Port server
const PORT = 3000;

// Middleware untuk melayani file statis dari folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// Jika route root "/" diakses, kirimkan file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
