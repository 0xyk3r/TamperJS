console.log(
  "%cTamperJS%cTamperJS Loaded",
  "background-color: gold; color: black; padding: 5px;",
  "background-color: black; color: gold; padding: 5px;"
);

window.TamperJS = {
  /**
   * 观察与给定选择器匹配的元素，并在找到元素时执行回调函数。
   * @param {string} selector - 要匹配元素的 CSS 选择器。
   * @param {Function} callback - 找到元素时要执行的回调函数。
   */
  observeElementExist: (selector, callback) => {
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId);
        callback(element);
      }
    }, 500);
  },

  /**
   * 观察与给定选择器匹配的元素，并在指定时机执行回调函数。
   * @param {*} selector  要匹配元素的 CSS 选择器。
   * @param {*} config  观察选项
   * @param {*} callback  指定时机要执行的回调函数。
   * @returns 
   */
  observerElement: (selector, config, callback) => {
      const element = document.querySelector(selector);
      if (!element) {
          console.warn(`Element with selector "${selector}" not found.`);
          return;
      }
      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callback);
      // 传入目标节点和观察选项
      observer.observe(element, config);
      // 返回观察器实例，以便可以在外部停止观察
      return observer;
  },

  /**
   * 执行任务队列
   * @param {*} taskQueue 
   * @returns 
   */
  executeTaskQueue: (taskQueue) => {
    return new Promise((resolve, reject) => {
      const executeTask = async (task) => {
        if (task.type === 'timer') {
          await new Promise((resolve) => setTimeout(resolve, task.delay));
        } else if (task.type === "handler" && task.selector && task.condition && task.callback) {
          const intervalId = setInterval(() => {
            const element = document.querySelector(task.selector);
            if (element && task.condition(element)) {
              clearInterval(intervalId);
              task.callback(element);
              resolve();
            }
          }, 500);
        } else {
          reject(new Error("Invalid task."));
        }
      };

      const executeNextTask = async (index) => {
        if (index < taskQueue.length) {
          await executeTask(taskQueue[index]);
          await executeNextTask(index + 1);
        } else {
          resolve();
        }
      };

      executeNextTask(0);
    });
  },

  /**
   * 检查元素是否在视口内。
   * @param {Element} el - 要检查的元素。
   * @returns {boolean} - 如果元素在视口内，则为 true；否则为 false。
   */
  isElementInViewport: (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * 使元素可拖动。
   * @param {Element} draggableElement - 用于拖动元素的元素。
   * @param {Element} element - 要拖动的元素。
   */
  attachDragBehaviorToElement: (draggableElement, element) => {
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
  },

  /**
   * 添加全局样式
   * @param {String} styleId - 样式ID
   * @param {String} styleText - 样式内容
   */
  addStyle: (styleId, styleText) => {
    if (document.getElementById(styleId) == null) {
      let styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.innerHTML = styleText;
      document.body.append(styleElement);
    }
  },

  /**
   * 移除全局样式
   * @param {String} styleId - 样式ID
   */
  removeStyle: (styleId) => {
    let e = document.getElementById(styleId);
    if (e !== null) {
      document.getElementById(styleId).remove();
    }
  },
};
