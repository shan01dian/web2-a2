const express = require('express');
const { pool } = require('../event_db');
const router = express.Router();

// 获取所有活跃事件
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id 
            WHERE e.status = 'upcoming' 
            ORDER BY e.date ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 搜索事件
router.get('/search', async (req, res) => {
    try {
        const { date, location, category } = req.query;

        let query = `
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id 
            WHERE e.status = 'upcoming'
        `;
        const params = [];

        if (date) {
            query += ' AND DATE(e.date) = ?';
            params.push(date);
        }
        if (location) {
            query += ' AND e.location LIKE ?';
            params.push(`%${location}%`);
        }
        if (category) {
            query += ' AND c.id = ?';
            params.push(category);
        }

        query += ' ORDER BY e.date ASC';

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 获取事件详情
router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const [rows] = await pool.execute(`
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id 
            WHERE e.id = ?
        `, [eventId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;