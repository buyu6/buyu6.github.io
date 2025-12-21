/* source/js/auto_footer.js (v2.0 增强版) */
(function() {
    function syncFooter() {
        // 1. 找到顶部大图
        var topHeader = document.getElementById('page-header');
        // 2. 找到底部
        var footer = document.getElementById('footer');

        // 如果找不到元素，直接退出
        if (!topHeader || !footer) return;

        // ===========================================
        // 核心逻辑：想尽办法获取顶部图片的 URL
        // ===========================================
        var bgImage = '';

        // 【尝试 A】直接获取计算后的 CSS 背景图 (标准情况)
        var style = window.getComputedStyle(topHeader);
        if (style.backgroundImage && style.backgroundImage !== 'none') {
            bgImage = style.backgroundImage;
        }

        // 【尝试 B】如果是懒加载 (Lazyload)，背景可能在 data-bg 属性里
        if (!bgImage || bgImage === 'none') {
            var lazyBg = topHeader.getAttribute('data-bg');
            if (lazyBg) {
                // 补全 url() 格式
                bgImage = 'url("' + lazyBg + '")';
            }
        }
        
        // 【尝试 C】针对首页的特殊补救 (如果还是抓不到)
        // 你可以在这里把那个和首页一样的图片路径写死，作为最后的保险
        if ((!bgImage || bgImage === 'none') && window.location.pathname === '/') {
            // 请把下面的路径改成你首页 index_img 的真实路径！
            // bgImage = 'url("/img/5965e4e1f10be25908720032e4b3efbc.jpg")'; 
        }

        // ===========================================
        // 赋值给底部
        // ===========================================
        if (bgImage && bgImage !== 'none') {
            footer.style.backgroundImage = bgImage;
            footer.style.backgroundPosition = 'bottom center';
            // 调试信息：如果你按F12看控制台，能看到成功同步了什么图
            console.log('Footer Sync Success:', bgImage);
        } else {
            console.log('Footer Sync Failed: No image found.');
        }
    }

    // 监听页面加载完成
    document.addEventListener('DOMContentLoaded', syncFooter);
    
    // 【额外保险】针对 Pjax (如果你开启了 Pjax，这就很有用)
    document.addEventListener('pjax:complete', syncFooter);
})();