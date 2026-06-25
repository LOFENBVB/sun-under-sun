# 太阳底下无新事

用哲学家和政治家的智慧回应你的困惑。

输入你的问题，系统自动匹配最合适的思想家，以 D 模式三步回应（诊断→转念→行动）给出锋利、深刻的哲学洞见。

## 使用

1. 在 [DeepSeek 平台](https://platform.deepseek.com) 获取 API key
2. 打开 `dist/index.html`，输入 API key
3. 开始对话

## 技术

纯前端单 HTML 文件，语录 JSON 内嵌，DeepSeek API 驱动。无需服务器，可直接部署到 GitHub Pages。

## 开发

```bash
# 构建语录数据
node scripts/prepare-quotes.js

# 部署文件在 dist/index.html
```
