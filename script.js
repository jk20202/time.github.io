const baseEvents = ['休息1', '休息2', '白班1', '白班2', '夜班1', '夜班2'];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

function drawCalendar(year, month) {
    const monthYearLabel = document.getElementById('monthYear');
    monthYearLabel.textContent = `${year}年${month}月`;

    const datesDiv = document.getElementById('dates');
    datesDiv.innerHTML = '';

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
        const prevSpan = document.createElement('span');
        prevSpan.textContent = prevMonthDays - i;
        prevSpan.classList.add('inactive');
        datesDiv.appendChild(prevSpan);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateSpan = document.createElement('span');
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;

        const event = getEventForDate(year, month, day);

        const eventText = document.createElement('div');
        eventText.className = 'event-text';
        eventText.textContent = event;

        dateSpan.appendChild(dayNumber);
        dateSpan.appendChild(eventText);

        dateSpan.addEventListener('click', () => {
            // Remove 'selected' class from all dateSpans
            const allDateSpans = datesDiv.querySelectorAll('span');
            allDateSpans.forEach(span => span.classList.remove('selected'));

            // Add 'selected' class to the clicked dateSpan
            dateSpan.classList.add('selected');
        });

        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()) {
            dateSpan.classList.add('today');
        }

        datesDiv.appendChild(dateSpan);
    }

    const remainingDays = 42 - datesDiv.children.length;
    for (let i = 1; i <= remainingDays; i++) {
        const nextSpan = document.createElement('span');
        nextSpan.textContent = i;
        nextSpan.classList.add('inactive');
        datesDiv.appendChild(nextSpan);
    }
}

function getEventForDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    const start = new Date(2024, 5, 1);  // 2024年6月1日
    if (date < start) {
        return ''; // 指定日期之前不显示事件
    }
    const dayOfYearFromStart = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    return baseEvents[dayOfYearFromStart % baseEvents.length];
}

document.getElementById('prevMonth').onclick = () => {
    currentMonth--;
    if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    drawCalendar(currentYear, currentMonth);
};

document.getElementById('nextMonth').onclick = () => {
    currentMonth++;
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    }
    drawCalendar(currentYear, currentMonth);
};

document.getElementById('goToday').onclick = () => {
    currentYear = new Date().getFullYear();
    currentMonth = new Date().getMonth() + 1;
    drawCalendar(currentYear, currentMonth);
};

function updateTime() {
    const currentTimeLabel = document.getElementById('currentTime');
    const now = new Date();
    currentTimeLabel.textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
}

// 添加触摸事件处理函数
let startX;
const datesDiv = document.getElementById('dates');

datesDiv.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
}, false);

datesDiv.addEventListener('touchmove', (event) => {
    if (!startX) {
        return;
    }

    const moveX = event.touches[0].clientX;
    const diffX = startX - moveX;

    if (diffX > 50) {
        // 左滑，下一月
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        drawCalendar(currentYear, currentMonth);
        startX = null;
    } else if (diffX < -50) {
        // 右滑，上一月
        currentMonth--;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        drawCalendar(currentYear, currentMonth);
        startX = null;
    }
}, false);

datesDiv.addEventListener('touchend', () => {
    startX = null;
}, false);

drawCalendar(currentYear, currentMonth);
updateTime();
setInterval(updateTime, 1000);
