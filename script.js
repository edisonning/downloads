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

    // 添加二维码长按保存功能
    setupQRCodeInteraction();

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
            e.preventDefault();
            
            const isAndroidLink = this.closest('.download-card').querySelector('.platform-icon.android');
            const platform = isAndroidLink ? 'Android' : 'iOS';
            
            // 显示下载提示
            showDownloadModal(platform);
            
            // 统计下载点击
            trackDownload(platform);
        });
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

// 设置二维码交互
function setupQRCodeInteraction() {
    const qrCodes = document.querySelectorAll('.qr-placeholder');
    
    qrCodes.forEach(qr => {
        // 长按保存提示
        let longPressTimer;
        
        qr.addEventListener('touchstart', function(e) {
            longPressTimer = setTimeout(() => {
                showToast('长按保存二维码到相册');
            }, 1000);
        });
        
        qr.addEventListener('touchend', function(e) {
            clearTimeout(longPressTimer);
        });
        
        qr.addEventListener('touchmove', function(e) {
            clearTimeout(longPressTimer);
        });
        
        // 点击放大二维码
        qr.addEventListener('click', function() {
            enlargeQRCode(this);
        });
    });
}

// 放大二维码
function enlargeQRCode(qrElement) {
    const overlay = document.createElement('div');
    overlay.className = 'qr-overlay';
    overlay.innerHTML = `
        <div class="enlarged-qr">
            ${qrElement.innerHTML}
            <p>扫描二维码下载App</p>
            <button class="close-enlarged">关闭</button>
        </div>
    `;
    
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const enlargedQR = overlay.querySelector('.enlarged-qr');
    enlargedQR.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        animation: zoomIn 0.3s ease;
    `;
    
    enlargedQR.querySelector('svg').style.cssText = `
        width: 200px;
        height: 200px;
    `;
    
    document.body.appendChild(overlay);
    
    // 关闭事件
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.classList.contains('close-enlarged')) {
            document.body.removeChild(overlay);
        }
    });
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