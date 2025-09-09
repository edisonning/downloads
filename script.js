// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 检测用户设备类型
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');

    // 高亮对应平台的下载卡片
    if (isAndroid) {
        highlightPlatform('android');
    } else if (isIOS) {
        highlightPlatform('ios');
    }

    // 添加下载链接点击事件
    setupDownloadLinks();

    // 添加平滑滚动
    setupSmoothScroll();

    // 添加触摸反馈
    setupTouchFeedback();
});

// 高亮对应平台
function highlightPlatform(platform) {
    const cards = document.querySelectorAll('.download-card');
    cards.forEach(card => {
        const isTargetPlatform = card.querySelector(`.platform-icon.${platform}`);
        if (isTargetPlatform) {
            card.style.border = '2px solid #2563eb';
            card.style.boxShadow = '0 8px 32px rgba(37, 99, 235, 0.2)';
            
            // 添加推荐标签
            const badge = document.createElement('div');
            badge.className = 'recommended-badge';
            badge.textContent = '推荐';
            badge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                font-size: 0.75rem;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-weight: 600;
                z-index: 10;
            `;
            card.style.position = 'relative';
            card.appendChild(badge);
        }
    });
}

// 设置下载链接
function setupDownloadLinks() {
    const downloadLinks = document.querySelectorAll('.download-link');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const isAndroidLink = this.closest('.download-card').querySelector('.platform-icon.android');
            const platform = isAndroidLink ? 'Android' : 'iOS';
            
            // 检测是否在微信中
            const userAgent = navigator.userAgent.toLowerCase();
            const isWeChat = userAgent.includes('micromessenger');
            
            if (isAndroidLink && isWeChat) {
                // 在微信中点击Android下载，显示浏览器打开提示
                e.preventDefault();
                showWeChatBrowserTip();
            } else if (!isAndroidLink) {
                // iOS显示提示
                e.preventDefault();
                showDownloadModal(platform);
            }
            // Android在非微信环境下直接下载，不阻止默认行为
            
            // 统计下载点击
            trackDownload(platform);
        });
    });
}

// 显示微信浏览器打开提示
function showWeChatBrowserTip() {
    const modal = document.createElement('div');
    modal.className = 'wechat-tip-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🚀 下载车载终端运维App</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tip-icon">📱</div>
                <p class="tip-text">检测到您正在微信中访问</p>
                <p class="tip-desc">为了正常下载APK文件，请按以下步骤操作：</p>
                <div class="steps-container">
                    <div class="step-item">
                        <span class="step-num">1</span>
                        <span>点击右上角 <strong>⋯</strong> 菜单</span>
                    </div>
                    <div class="step-item">
                        <span class="step-num">2</span>
                        <span>选择 <strong>"在浏览器中打开"</strong></span>
                    </div>
                    <div class="step-item">
                        <span class="step-num">3</span>
                        <span>在浏览器中重新点击下载按钮</span>
                    </div>
                </div>
                <div class="browser-icons">
                    <span>🌐 Chrome</span>
                    <span>🦊 Firefox</span>
                    <span>🧭 Safari</span>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
        padding: 1rem;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        text-align: center;
        max-width: 350px;
        width: 100%;
        animation: slideUp 0.3s ease;
        overflow: hidden;
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        color: white;
        padding: 1.5rem;
        position: relative;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 2rem 1.5rem;
    `;
    
    const tipIcon = modal.querySelector('.tip-icon');
    tipIcon.style.cssText = `
        font-size: 3rem;
        margin-bottom: 1rem;
    `;
    
    const tipText = modal.querySelector('.tip-text');
    tipText.style.cssText = `
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
    `;
    
    const tipDesc = modal.querySelector('.tip-desc');
    tipDesc.style.cssText = `
        font-size: 0.9rem;
        color: #6b7280;
        margin-bottom: 1.5rem;
    `;
    
    const stepsContainer = modal.querySelector('.steps-container');
    stepsContainer.style.cssText = `
        text-align: left;
        margin-bottom: 1.5rem;
    `;
    
    const stepItems = modal.querySelectorAll('.step-item');
    stepItems.forEach(item => {
        item.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            line-height: 1.4;
        `;
    });
    
    const stepNums = modal.querySelectorAll('.step-num');
    stepNums.forEach(num => {
        num.style.cssText = `
            background: #3b82f6;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
            margin-right: 1rem;
            flex-shrink: 0;
        `;
    });
    
    const browserIcons = modal.querySelector('.browser-icons');
    browserIcons.style.cssText = `
        display: flex;
        justify-content: space-around;
        font-size: 0.8rem;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
        padding-top: 1rem;
        margin-top: 1rem;
    `;
    
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 1.5rem;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    
    // 关闭按钮事件
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 显示下载模态框
function showDownloadModal(platform) {
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>下载 ${platform} 版本</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>即将为您跳转到${platform === 'Android' ? '下载页面' : 'App Store'}...</p>
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        max-width: 300px;
        margin: 1rem;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // 关闭按钮事件
    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // 3秒后自动关闭
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 3000);
}



// 设置平滑滚动
function setupSmoothScroll() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// 设置触摸反馈
function setupTouchFeedback() {
    const interactiveElements = document.querySelectorAll('.download-card, .feature-item, .download-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-size: 0.875rem;
        z-index: 1000;
        animation: slideUpToast 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// 统计下载点击
function trackDownload(platform) {
    // 这里可以添加统计代码
    console.log(`用户点击了${platform}下载链接`);
    
    // 示例：发送统计数据到服务器
    // fetch('/api/track-download', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         platform: platform,
    //         timestamp: new Date().toISOString(),
    //         userAgent: navigator.userAgent
    //     })
    // });
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes zoomIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideUpToast {
        from { transform: translateX(-50%) translateY(20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 1rem auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// 页面可见性检测
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // 页面重新可见时的处理
        console.log('页面重新可见');
    }
});

// 网络状态检测
window.addEventListener('online', function() {
    showToast('网络连接已恢复');
});

window.addEventListener('offline', function() {
    showToast('网络连接已断开');
});