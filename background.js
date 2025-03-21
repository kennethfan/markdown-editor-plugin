// 监听插件图标点击事件
chrome.action.onClicked.addListener(() => {
    // 打开新标签页并加载 popup.html
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
});