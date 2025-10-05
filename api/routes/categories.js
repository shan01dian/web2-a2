const express = require('express');
const { pool } = require('../event_db');
const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;