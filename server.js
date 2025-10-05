const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./api/event_db'); // 导入mysql2连接池

const app = express();
const PORT = process.env.PORT || 3000;




// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static('public'));

// API路由
app.get('/api/events', getEvents);
app.get('/api/events/search', searchEvents);
app.get('/api/events/:id', getEventById);
app.get('/api/categories', getCategories);

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// 使用async/await的API函数实现
async function getEvents(req, res) {
    try {
        const query = `
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id 
            WHERE e.status = 'upcoming' 
            ORDER BY e.date ASC
        `;

        // mysql2连接池的query方法返回Promise
        const [results] = await db.promise().query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: error.message });
    }
}

async function searchEvents(req, res) {
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
            query += ' AND e.category_id = ?';
            params.push(category);
        }

        query += ' ORDER BY e.date ASC';

        const [results] = await db.promise().query(query, params);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getEventById(req, res) {
    try {
        const eventId = req.params.id;
        const query = `
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id 
            WHERE e.id = ?
        `;

        const [results] = await db.promise().query(query, [eventId]);

        if (results.length === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        res.json(results[0]);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getCategories(req, res) {
    try {
        const [results] = await db.promise().query('SELECT * FROM categories');
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: error.message });
    }
}