let categories = [];

// 加载分类数据
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();

        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">所有分类</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// 搜索事件
async function searchEvents(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        if (value) params.append(key, value);
    }

    try {
        const response = await fetch(`/api/events/search?${params}`);
        const events = await response.json();
        displaySearchResults(events);
    } catch (error) {
        console.error('Error searching events:', error);
    }
}

// 清空筛选
function clearFilters() {
    document.getElementById('search-form').reset();
    document.getElementById('search-results').innerHTML = '';
}

// 显示搜索结果
function displaySearchResults(events) {
    const resultsContainer = document.getElementById('search-results');

    if (events.length === 0) {
        resultsContainer.innerHTML = '<p>没有找到匹配的事件。</p>';
        return;
    }

    resultsContainer.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.name}</h3>
            <p>日期: ${new Date(event.date).toLocaleDateString()}</p>
            <p>地点: ${event.location}</p>
            <p>类别: ${event.category_name}</p>
            <a href="event-detail.html?id=${event.id}">查看详情</a>
        </div>
    `).join('');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    document.getElementById('search-form').addEventListener('submit', searchEvents);
    document.getElementById('clear-btn').addEventListener('click', clearFilters);
});