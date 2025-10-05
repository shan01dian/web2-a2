const { pool } = require('../api/event_db');

async function initializeDatabase() {
    try {
        // 检查连接
        const connection = await pool.getConnection();
        console.log('✅ Database connection established');
        connection.release();

        // 这里可以添加其他初始化逻辑
        console.log('✅ Database setup completed');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { initializeDatabase };