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