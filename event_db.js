const mysql = require('mysql2/promise');

// 创建数据库连接池（推荐方式）
const pool = mysql.createPool({
    connectionLimit: 10, // 连接池大小
    host: 'localhost',   // 数据库主机地址
    user: 'root',       // 数据库用户名
    password: '0126', // 数据库密码
    database: 'charityevents_db', // 数据库名称
    waitForConnections: true,
    queueLimit: 0
});

// 测试连接池是否可用
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database with id', connection.threadId);
        // 释放连接回连接池
        connection.release();
        return true;
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
        return false;
    }
}

// 导出连接池和测试函数，以便在其他文件中使用
module.exports = {
    pool,
    testConnection
};