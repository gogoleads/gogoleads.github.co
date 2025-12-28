// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 加载完成，开始初始化...');

    // 初始化所有功能
    try {
        initCalculator();
        console.log('计算器初始化成功');

        initSmoothScroll();
        console.log('平滑滚动初始化成功');

        initNavigation();
        console.log('导航初始化成功');

        initFormValidation();
        console.log('表单验证初始化成功');

        initButtons();
        console.log('按钮功能初始化成功');
    } catch (error) {
        console.error('初始化错误:', error);
    }
});

// 收益计算器功能
function initCalculator() {
    const pageviewsInput = document.getElementById('pageviews');
    const rpmInput = document.getElementById('rpm');
    const monthlyRevenueElement = document.getElementById('monthly-revenue');

    function calculateRevenue() {
        const pageviews = parseFloat(pageviewsInput.value) || 0;
        const rpm = parseFloat(rpmInput.value) || 0;

        // 计算月收入 = (每日页面浏览量 * 每千次展示收入 * 30) / 1000
        const monthlyRevenue = (pageviews * rpm * 30) / 1000;

        // 格式化货币显示
        monthlyRevenueElement.textContent = `$${monthlyRevenue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    }

    // 监听输入变化
    pageviewsInput.addEventListener('input', calculateRevenue);
    rpmInput.addEventListener('input', calculateRevenue);

    // 初始计算
    calculateRevenue();
}

// 平滑滚动功能
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 导航栏交互
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    const navUser = document.querySelector('.nav-user');

    // 创建移动端菜单按钮
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.innerHTML = `
        <span class="material-icons">menu</span>
    `;

    // 在移动端添加菜单按钮
    function updateNavigation() {
        if (window.innerWidth <= 768) {
            if (!navUser.querySelector('.menu-toggle')) {
                navUser.appendChild(menuButton);
            }
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            const toggle = navUser.querySelector('.menu-toggle');
            if (toggle) {
                toggle.remove();
            }
        }
    }

    // 菜单切换功能
    menuButton.addEventListener('click', function() {
        const isMenuVisible = navMenu.style.display === 'flex';
        navMenu.style.display = isMenuVisible ? 'none' : 'flex';

        // 更新图标
        this.innerHTML = isMenuVisible ?
            '<span class="material-icons">menu</span>' :
            '<span class="material-icons">close</span>';
    });

    // 滚动时添加阴影效果
    function handleScroll() {
        if (window.scrollY > 0) {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }

    // 监听事件
    window.addEventListener('resize', updateNavigation);
    window.addEventListener('scroll', handleScroll);

    // 初始化
    updateNavigation();
}

// 表单验证功能
function initFormValidation() {
    // 监听所有表单提交
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm(this)) {
                // 显示成功消息
                showMessage('表单提交成功！', 'success');
                this.reset();
            }
        });
    });

    // 实时验证输入字段
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // 清除错误提示
            clearFieldError(this);
        });
    });
}

// 表单验证函数
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// 字段验证
function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute('required') && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }

    // 邮箱验证
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
    }

    // 数字验证
    if (field.type === 'number' && value) {
        const num = parseFloat(value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);

        if (!isNaN(min) && num < min) {
            showFieldError(field, `值不能小于 ${min}`);
            return false;
        }

        if (!isNaN(max) && num > max) {
            showFieldError(field, `值不能大于 ${max}`);
            return false;
        }
    }

    return true;
}

// 显示字段错误
function showFieldError(field, message) {
    clearFieldError(field);

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
}

// 清除字段错误
function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;

    // 添加样式
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? 'var(--success-color)' :
                           type === 'error' ? 'var(--error-color)' :
                           'var(--primary-color)'};
        color: white;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 添加到页面
    document.body.appendChild(messageElement);

    // 自动移除
    setTimeout(() => {
        messageElement.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}

// 添加加载动画
function showLoading(element, text = '加载中...') {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = `
        <div class="loading-spinner"></div>
        <span>${text}</span>
    `;

    // 添加加载样式
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background-color: var(--bg-gray);
            border-radius: 8px;
        }
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid var(--border-color);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    element.appendChild(loadingElement);
    return loadingElement;
}

// 按钮功能初始化
function initButtons() {
    console.log('开始初始化按钮功能...');

    // 立即开始按钮
    const startBtn = document.querySelector('.btn-primary');
    console.log('立即开始按钮:', startBtn);
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('立即开始按钮被点击');
            showMessage('正在跳转到注册页面...', 'info');
            // 实际项目中这里应该跳转到注册页面
            setTimeout(() => {
                window.location.href = '#signup';
            }, 1000);
        });
    } else {
        console.log('未找到立即开始按钮');
    }

    // 了解更多按钮
    const learnMoreBtn = document.querySelector('.btn-secondary');
    console.log('了解更多按钮:', learnMoreBtn);
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            console.log('了解更多按钮被点击');
            // 滚动到功能特点部分
            const featuresSection = document.querySelector('.features');
            if (featuresSection) {
                featuresSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    } else {
        console.log('未找到了解更多按钮');
    }

    // 登录按钮 (移除自动跳转逻辑，由index.html中的代码处理)
    // 登录按钮的逻辑已在index.html中定义，这里跳过以避免冲突

    // 导航菜单链接
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                // 平滑滚动到页面内锚点
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (href === 'dashboard.html') {
                // 跳转到控制台
                showMessage('正在跳转到控制台...', 'info');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            } else {
                // 其他页面显示开发中提示
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    z-index: 10000;
                    max-width: 400px;
                    text-align: center;
                `;
                modal.innerHTML = `
                    <h2 style="margin-bottom: 20px;">${this.textContent}</h2>
                    <p style="color: #5f6368; margin-bottom: 30px;">此页面正在开发中，敬请期待！</p>
                    <button onclick="this.parentElement.remove(); document.getElementById('overlay').remove();" style="
                        padding: 10px 24px;
                        background: #1a73e8;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                    ">关闭</button>
                `;
                document.body.appendChild(modal);

                // 添加背景遮罩
                const overlay = document.createElement('div');
                overlay.id = 'overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                `;
                overlay.onclick = function() {
                    modal.remove();
                    overlay.remove();
                };
                document.body.appendChild(overlay);
            }
        });
    });

    // 社交媒体链接
    const socialLinks = document.querySelectorAll('.social-links a');
    console.log('社交媒体链接数量:', socialLinks.length);
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('.material-icons').textContent;
            showMessage(`正在打开 ${platform} 页面...`, 'info');
        });
    });

    // 其他页脚链接（排除社交媒体和"关于我们"）
    const otherFooterLinks = document.querySelectorAll('.footer-section ul li a:not([href="about.html"])');
    console.log('其他页脚链接数量:', otherFooterLinks.length);
    otherFooterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent;
            showMessage(`${text} 页面正在建设中...`, 'info');
        });
    });
}

// 工具函数
const utils = {
    // 格式化数字
    formatNumber: function(num, decimals = 0) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    // 格式化货币
    formatCurrency: function(amount, currency = '$') {
        return `${currency}${this.formatNumber(amount)}`;
    },

    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 防抖函数
    debounce: function(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
};