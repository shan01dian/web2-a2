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
app.use(express.static('client'));

// 简单测试路由
app.get('/test', (req, res) => {
    res.send('<h1>服务器运行正常</h1><p>如果看到此页面，说明服务器配置正确</p>');
});

// 根路径路由 - 显示数据库内容
app.get('/', async (req, res) => {
    console.log('Root route accessed');
    try {
        console.log('Attempting to query database...');
        // 获取所有事件
        const [events] = await db.promise().query(`
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id 
            ORDER BY e.date ASC
        `);
        console.log('Events query successful, found:', events.length, 'events');
        console.log('Events data:', JSON.stringify(events, null, 2));
        
        // 获取所有分类
        const [categories] = await db.promise().query('SELECT * FROM categories');
        console.log('Categories query successful, found:', categories.length, 'categories');
        console.log('Categories data:', JSON.stringify(categories, null, 2));
        
        // 构造HTML响应
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>慈善活动数据库</title>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2 { color: #333; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <h1>慈善活动数据库内容</h1>
            <p>数据库连接成功，找到 ${categories.length} 个分类和 ${events.length} 个活动</p>
            
            <h2>活动分类</h2>
            <table>
                <tr><th>ID</th><th>名称</th><th>描述</th></tr>`;
                
        categories.forEach(category => {
            html += `<tr><td>${category.id}</td><td>${category.name}</td><td>${category.description || ''}</td></tr>`;
        });
        
        html += `</table>
            <h2>活动列表</h2>
            <table>
                <tr><th>ID</th><th>名称</th><th>描述</th><th>日期</th><th>地点</th><th>分类</th><th>目标</th><th>进度</th><th>票价</th><th>状态</th></tr>`;
                
        events.forEach(event => {
            html += `<tr>
                <td>${event.id}</td>
                <td>${event.name}</td>
                <td>${event.description || ''}</td>
                <td>${new Date(event.date).toLocaleDateString('zh-CN')}</td>
                <td>${event.location}</td>
                <td>${event.category_name || '未分类'}</td>
                <td>${event.goal || 0}</td>
                <td>${event.progress || 0}</td>
                <td>${event.ticket_price || 0}</td>
                <td>${event.status}</td>
            </tr>`;
        });
        
        html += `</table>
        </body>
        </html>`;
        
        console.log('Sending HTML response');
        res.send(html);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('<h1>数据库查询错误</h1><p>' + error.message + '</p><pre>' + error.stack + '</pre>');
    }
});;

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