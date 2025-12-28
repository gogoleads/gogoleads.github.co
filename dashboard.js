// 初始化仪表板
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    initDateRange();
    initChartTypeToggle();
    initTableExport();
});

// 图表配置
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            }
        }
    }
};

// 初始化图表
function initCharts() {
    // 收益趋势图表
    const earningsCtx = document.getElementById('earningsChart').getContext('2d');
    window.earningsChart = new Chart(earningsCtx, {
        type: 'line',
        data: {
            labels: generateDateLabels(7),
            datasets: [{
                label: 'Daily Earnings ($)',
                data: [0.82, 1.24, 0.96, 1.45, 1.12, 0.89, 1.35],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'Impressions',
                data: [156, 182, 145, 198, 167, 134, 175],
                borderColor: '#34a853',
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // 网站表现饼图
    const sitesCtx = document.getElementById('sitesChart').getContext('2d');
    window.sitesChart = new Chart(sitesCtx, {
        type: 'doughnut',
        data: {
            labels: ['seodog.cn'],
            datasets: [{
                data: [100],
                backgroundColor: [
                    '#1a73e8'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

// 生成日期标签
function generateDateLabels(days) {
    const labels = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const month = date.getMonth() + 1;
        const day = date.getDate();
        labels.push(`${month}/${day}`);
    }

    return labels;
}

// 日期范围选择
function initDateRange() {
    const dateRange = document.getElementById('dateRange');

    dateRange.addEventListener('change', function() {
        const selectedRange = this.value;
        let days = 7;

        switch(selectedRange) {
            case 'today':
            case 'yesterday':
                days = 1;
                break;
            case '7days':
                days = 7;
                break;
            case '30days':
                days = 30;
                break;
            case 'thisMonth':
                days = new Date().getDate();
                break;
            case 'lastMonth':
                days = getDaysInLastMonth();
                break;
            case 'custom':
                showCustomDateDialog();
                return;
        }

        updateCharts(days);
        updateStats(days);
    });
}

// 获取上月天数
function getDaysInLastMonth() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
    return lastMonth.getDate();
}

// 更新图表数据
function updateCharts(days) {
    // 生成新的随机数据
    const newEarningsData = generateRandomData(days, 0.7, 1.5);
    const newViewsData = generateRandomData(days, 120, 200);

    // 更新收益图表
    window.earningsChart.data.labels = generateDateLabels(days);
    window.earningsChart.data.datasets[0].data = newEarningsData;
    window.earningsChart.data.datasets[1].data = newViewsData;
    window.earningsChart.update();

    // 显示加载动画
    showChartLoading();
}

// 更新统计数据
function updateStats(days) {
    // 模拟数据更新，基于 $483.44 总收入（9月1日-12月28日共118天）
    const totalPeriodDays = 118; // Sep(30) + Oct(31) + Nov(30) + Dec(28) = 118天
    const dailyAverage = 483.44 / totalPeriodDays;
    const estimatedEarnings = dailyAverage * days;

    document.querySelector('.stat-value').textContent = `$${estimatedEarnings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

    // 可以添加更多统计数据的更新逻辑
}

// 生成随机数据
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const value = Math.random() * (max - min) + min;
        data.push(Math.round(value * 100) / 100);
    }
    return data;
}

// 图表类型切换
function initChartTypeToggle() {
    const chartBtns = document.querySelectorAll('.chart-btn');

    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const type = this.dataset.type;
            window.earningsChart.config.type = type;
            window.earningsChart.update();
        });
    });
}

// 显示图表加载动画
function showChartLoading() {
    const charts = document.querySelectorAll('.chart-container');

    charts.forEach(chart => {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'chart-loading';
        loadingElement.innerHTML = '<div class="loading-spinner"></div>';
        loadingElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
        `;

        chart.appendChild(loadingElement);

        setTimeout(() => {
            loadingElement.remove();
        }, 500);
    });
}

// 表格导出功能
function initTableExport() {
    const exportBtn = document.querySelector('.btn-icon');

    exportBtn.addEventListener('click', function() {
        exportTableToCSV('ad_unit_performance');
    });
}

// 导出表格为 CSV
function exportTableToCSV(filename) {
    const table = document.querySelector('.data-table');
    const rows = table.querySelectorAll('tr');

    let csv = [];

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];

        cols.forEach(col => {
            rowData.push(col.textContent.trim());
        });

        csv.push(rowData.join(','));
    });

    // 创建下载链接
    const csvFile = new Blob(['\ufeff' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 显示成功消息
    showMessage('Table exported successfully!', 'success');
}

// 显示自定义日期对话框
function showCustomDateDialog() {
    // 这里可以实现一个自定义日期选择对话框
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    const endDate = prompt('Enter end date (YYYY-MM-DD):');

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (days > 0 && days <= 365) {
            updateCharts(days);
            updateStats(days);
        } else {
            alert('Please select a valid date range (maximum 365 days)');
        }
    }
}

// 实时数据更新（模拟）
function startRealTimeUpdates() {
    setInterval(() => {
        // 随机更新一些数值
        const statValues = document.querySelectorAll('.stat-value');
        const randomIndex = Math.floor(Math.random() * statValues.length);

        if (randomIndex === 0) {
            // 更新收入
            const currentValue = parseFloat(statValues[randomIndex].textContent.replace('$', '').replace(',', ''));
            const change = (Math.random() - 0.5) * 0.1;
            const newValue = Math.max(0, currentValue + change);

            statValues[randomIndex].textContent = `$${newValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
    }, 5000);
}

// 添加表格排序功能
function initTableSorting() {
    const table = document.querySelector('.data-table');
    const headers = table.querySelectorAll('th');

    headers.forEach((header, index) => {
        if (index > 0) { // 跳过第一列（广告单元名称）
            header.style.cursor = 'pointer';
            header.style.position = 'relative';

            header.addEventListener('click', () => {
                sortTable(table, index);
            });
        }
    });
}

// 表格排序
function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;

        // 处理数字排序
        if (!isNaN(parseFloat(aValue.replace(/[^0-9.-]/g, '')))) {
            return parseFloat(bValue.replace(/[^0-9.-]/g, '')) -
                   parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        }

        // 字符串排序
        return aValue.localeCompare(bValue);
    });

    // 重新排列行
    rows.forEach(row => tbody.appendChild(row));
}

// 添加搜索功能
function addTableSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search ad units...';
    searchInput.className = 'table-search';
    searchInput.style.cssText = `
        margin-bottom: 16px;
        padding: 8px 16px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        width: 300px;
        font-size: 14px;
    `;

    const tableCard = document.querySelector('.table-card');
    tableCard.insertBefore(searchInput, tableCard.querySelector('.table-container'));

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.data-table tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// 初始化额外功能
setTimeout(() => {
    initTableSorting();
    addTableSearch();
    // startRealTimeUpdates(); // 取消注释以启用实时更新
}, 1000);