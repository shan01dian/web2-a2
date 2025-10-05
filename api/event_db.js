const mysql = require('mysql2'); // 改用 mysql2

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0126',
    database: 'charityevents_db'
}).promise(); // 关键：添加 .promise() 支持 Promise

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database with id', connection.threadId);
        console.log('测试成功');
        connection.release();
        return true;
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
        return false;
    }
}

// 导出和测试代码保持不变
module.exports = { pool, testConnection };

if (require.main === module) {
    testConnection()
        .then(() => {
            console.log('测试完成');
            pool.end(); // 关闭连接池
        })
        .catch(err => {
            console.error('测试异常:', err);
            pool.end();
            process.exit(1);
        });
}