// 获取编辑框和预览框的 DOM 元素
const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('markdown-preview');

// 配置 marked 使用 highlight.js 进行语法高亮
marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-'
});

// 自定义图片渲染器，处理本地文件路径
const renderer = new marked.Renderer();
renderer.image = function(param) {
    const href = param.href;
    const title = param.title;
    const text = param.text;
    console.log(href, title, text);
    // 检查是否为本地文件路径
    if (href.startsWith('./') || href.startsWith('../')) {
        href = chrome.runtime.getURL(href);
    }
    return `<img src="${href}" alt="${text}" ${title ? `title="${title}"` : ''}>`;
};

// 设置 marked 使用自定义渲染器
marked.use({ renderer });

// 监听编辑框的输入事件
editor.addEventListener('input', () => {
    const markdown = editor.value;
    const html = marked.parse(markdown);
    preview.innerHTML = html;
    // 应用语法高亮
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
});

// 初始化预览
const initialMarkdown = editor.value;
const initialHtml = marked.parse(initialMarkdown);
preview.innerHTML = initialHtml;

// Initialize highlight.js
document.addEventListener('DOMContentLoaded', (event) => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
    });
});

// 获取按钮和 toast 元素
const copyButton = document.getElementById('copy-button');
const saveButton = document.getElementById('save-button');
const toast = document.getElementById('toast');

// 复制按钮点击事件处理
copyButton.addEventListener('click', () => {
    const text = editor.value;
    navigator.clipboard.writeText(text).then(() => {
        // 显示 toast 提示
        toast.style.opacity = 1;
        setTimeout(() => {
            toast.style.opacity = 0;
        }, 2000);
    }).catch((err) => {
        console.error('复制失败: ', err);
    });
});

// 保存按钮点击事件处理
saveButton.addEventListener('click', () => {
    const text = editor.value;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown.md';
    a.click();
    URL.revokeObjectURL(url);
});