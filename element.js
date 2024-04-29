window.TamperJS = window.TamperJS || {};

/**
 * 观察与给定选择器匹配的元素的创建，并在找到元素时执行回调函数。
 * @param {string} selector - 要匹配的元素的 CSS 选择器。
 * @param {Function} callback - 找到元素时要执行的回调函数。
 */
TamperJS.observeElementCreation = (selector, callback) => {
    const intervalId = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(intervalId);
            callback(element);
        }
    }, 500);
}

/**
 * 检查元素是否在视口内。
 * @param {Element} el - 要检查的元素。
 * @returns {boolean} - 如果元素在视口内，则为 true；否则为 false。
 */
TamperJS.isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * 使元素可拖动。
 * @param {Element} draggableElement - 用于拖动元素的元素。
 * @param {Element} element - 要拖动的元素。
 */
TamperJS.attachDragBehaviorToElement = (draggableElement, element) => {
    let offsetX, offsetY;
    let isDragging = false;
    // 鼠标按下时触发
    draggableElement.addEventListener("mousedown", function (e) {
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
    });
    // 鼠标移动时触发
    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            e.preventDefault();
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            element.style.left = x + "px";
            element.style.top = y + "px";
        }
    });
    // 鼠标释放时触发
    document.addEventListener("mouseup", function () {
        isDragging = false;
        // 记录位置
        GM_setValue("DyPlus-MainPanel-Pos", {
            leftVal: element.style.left,
            topVal: element.style.top,
        });
    });
}

/**
 * 添加全局样式
 * @param {String} styleId - 样式ID
 * @param {String} styleText - 样式内容
 */
TamperJS.addStyle = (styleId, styleText) => {
    if (document.getElementById(styleId) == null) {
        let styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.innerHTML = styleText;
        document.body.append(styleElement);
    }
}

/**
 * 移除全局样式
 * @param {String} styleId - 样式ID
 */
TamperJS.removeStyle = (styleId) => {
    let e = document.getElementById(styleId);
    if (e !== null) {
        document.getElementById(styleId).remove();
    }
}

