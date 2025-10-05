const express = require('express');
const cors = require('cors');
const { testConnection } = require('./event_db');

const app = express();
const PORT = process.env.PORT || 3000;
console.log('PORT value:', PORT);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('../client')); // 提供静态文件服务

// 路由
app.use('/api/events', require('./routes/events'));
app.use('/api/categories', require('./routes/categories'));

// 健康检查端点
app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.json({
        status: 'OK',
        database: dbStatus ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // 测试数据库连接
    await testConnection();
});