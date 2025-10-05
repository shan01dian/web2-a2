// 主页事件加载
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();

        const eventsContainer = document.getElementById('events-container');
        eventsContainer.innerHTML = events.map(event => `
            <div class="event-card">
                <h3>${event.name}</h3>
                <p>日期: ${new Date(event.date).toLocaleDateString()}</p>
                <p>地点: ${event.location}</p>
                <p>类别: ${event.category_name}</p>
                <a href="event-detail.html?id=${event.id}">查看详情</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading events:', error);
    }
});