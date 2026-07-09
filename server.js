/*
 * server.js - GPS411 Tracker Server
 * Chay: node server.js
 * Port: 3000 (local) hoac tu dong theo Render.com
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Middleware
// ============================================================
app.use(cors());                    // Cho phep STM32 va browser gui request
app.use(express.json());            // Nhan JSON body
app.use(express.static('public')); // Phuc vu file tinh (index.html)

// ============================================================
// Luu tru du lieu trong bo nho (khong can database)
// ============================================================
let latestData = {
    lat      : 0,
    lng      : 0,
    speed    : 0,
    state    : 'UNKNOWN',
    armed    : 0,
    horn     : 0,
    updated  : null,   // Thoi diem cap nhat cuoi
    valid    : false   // GPS co fix chua
};

let pendingCommand = 'NONE'; // Lenh dang cho STM32: 'NONE' | 'ARM' | 'DISARM' | 'HORN_ON' | 'HORN_OFF'

let history = []; // Lich su 50 diem GPS gan nhat
const MAX_HISTORY = 50;

// ============================================================
// POST /api/data
// STM32 gui du lieu GPS len day moi 10 giay
// Body: { "lat": 10.123, "lng": 106.456, "speed": 0.0,
//         "state": "STANDBY", "armed": 1, "horn": 0 }
// Server tra ve lenh dieu khien: { "cmd": "NONE" }
// ============================================================
app.post('/api/data', (req, res) => {
    const { lat, lng, speed, state, armed, horn } = req.body;

    // Cap nhat du lieu moi nhat
    latestData = {
        lat    : parseFloat(lat)   || 0,
        lng    : parseFloat(lng)   || 0,
        speed  : parseFloat(speed) || 0,
        state  : state  || 'UNKNOWN',
        armed  : armed  ? 1 : 0,
        horn   : horn   ? 1 : 0,
        updated: new Date().toISOString(),
        valid  : (parseFloat(lat) !== 0 && parseFloat(lng) !== 0)
    };

    // Them vao lich su (neu co toa do hop le)
    if (latestData.valid) {
        history.push({
            lat  : latestData.lat,
            lng  : latestData.lng,
            time : latestData.updated
        });
        if (history.length > MAX_HISTORY) {
            history.shift(); // Xoa diem cu nhat
        }
    }

    console.log(`[${new Date().toLocaleTimeString('vi-VN')}] GPS: ${lat}, ${lng} | ${speed} km/h | ${state} | armed=${armed} | horn=${horn ? 'ON' : 'OFF'}`);

    // Tra ve lenh cho STM32, sau do reset lenh ve NONE
    const cmd = pendingCommand;
    pendingCommand = 'NONE';

    res.json({ cmd });
});

// ============================================================
// GET /api/status
// Trang web goi API nay moi 5 giay de cap nhat ban do
// ============================================================
app.get('/api/status', (req, res) => {
    res.json({
        latest : latestData,
        history: history
    });
});

// ============================================================
// POST /api/command
// Trang web gui lenh ARM hoac DISARM
// Body: { "cmd": "ARM" } hoac { "cmd": "DISARM" }
// ============================================================
app.post('/api/command', (req, res) => {
    const { cmd } = req.body;
    const validCmds = ['ARM', 'DISARM', 'HORN_ON', 'HORN_OFF'];

    if (validCmds.includes(cmd)) {
        pendingCommand = cmd;
        console.log(`[COMMAND] Lenh moi: ${cmd} - Cho STM32 ket noi de nhan...`);
        res.json({ success: true, message: `Lenh ${cmd} da duoc dat, cho STM32 ket noi...` });
    } else {
        res.status(400).json({ success: false, message: 'Lenh khong hop le' });
    }
});

// ============================================================
// Khoi dong server
// ============================================================
app.listen(PORT, () => {
    console.log(`GPS411 Server dang chay tai http://localhost:${PORT}`);
    console.log(`- Nhan du lieu GPS: POST /api/data`);
    console.log(`- Trang web ban do: http://localhost:${PORT}`);
});
