// 获取URL参数
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlParams.entries());
}

// 加载事件详情
async function loadEventDetail() {
    const { id } = getUrlParams();

    if (!id) {
        document.getElementById('event-detail').innerHTML = '<p>事件ID无效。</p>';
        return;
    }

    try {
        const response = await fetch(`/api/events/${id}`);
        const event = await response.json();

        displayEventDetail(event);
    } catch (error) {
        console.error('Error loading event detail:', error);
        document.getElementById('event-detail').innerHTML = '<p>加载事件详情失败。</p>';
    }
}

// 显示事件详情
function displayEventDetail(event) {
    const detailContainer = document.getElementById('event-detail');

    detailContainer.innerHTML = `
        <div class="event-detail">
            <h1>${event.name}</h1>
            <p class="event-category">${event.category_name}</p>
            <p class="event-date">日期: ${new Date(event.date).toLocaleString()}</p>
            <p class="event-location">地点: ${event.location}</p>
            <div class="event-description">
                <h3>活动描述</h3>
                <p>${event.description}</p>
            </div>
            <div class="event-fundraising">
                <h3>筹款信息</h3>
                <p>目标金额: $${event.goal}</p>
                <p>当前进度: $${event.progress}</p>
                <progress value="${event.progress}" max="${event.goal}"></progress>
            </div>
            <div class="event-ticket">
                <h3>票务信息</h3>
                <p>票价: $${event.ticket_price || '免费'}</p>
                <button onclick="showRegistration()" class="register-btn">立即报名</button>
            </div>
        </div>
    `;
}

// 显示注册弹窗
function showRegistration() {
    alert('此功能正在开发中。');
}

// 初始化
document.addEventListener('DOMContentLoaded', loadEventDetail);