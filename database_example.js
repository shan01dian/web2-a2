// database_example.js - 使用数据库连接的示例

const { pool } = require('./event_db');

// 示例1: 查询数据
async function getAllEvents() {
    try {
        const [rows] = await pool.execute('SELECT * FROM events');
        return rows;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

// 示例2: 插入数据
async function createEvent(eventData) {
    try {
        const { title, description, date } = eventData;
        const [result] = await pool.execute(
            'INSERT INTO events (title, description, date) VALUES (?, ?, ?)',
            [title, description, date]
        );
        return result;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
}

// 示例3: 更新数据
async function updateEvent(id, eventData) {
    try {
        const { title, description, date } = eventData;
        const [result] = await pool.execute(
            'UPDATE events SET title = ?, description = ?, date = ? WHERE id = ?',
            [title, description, date, id]
        );
        return result;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
}

// 示例4: 删除数据
async function deleteEvent(id) {
    try {
        const [result] = await pool.execute('DELETE FROM events WHERE id = ?', [id]);
        return result;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
}

module.exports = {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent
};