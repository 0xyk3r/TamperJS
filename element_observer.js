window.TamperJS = window.TamperJS || {};

TamperJS.observeElement = (selector, callback) => {
    const intervalId = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(intervalId);
            callback(element);
        }
    }, 100); // 每100毫秒检查一次
}

