import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// 创建markdown-it实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value
        return `<pre class="hljs"><code class="language-${lang}">${highlighted}</code></pre>`
      } catch (__) {}
    }
    
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 自定义渲染规则
md.renderer.rules.heading_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const level = token.tag
  const next = tokens[idx + 1]
  const content = next ? next.content : ''
  const anchor = content.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  
  return `<${level} id="${anchor}" class="heading-anchor">`
}

md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const href = token.attrGet('href')
  
  // 外部链接添加target="_blank"
  if (href && (href.startsWith('http') || href.startsWith('//'))) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  
  return renderer.renderToken(tokens, idx, options)
}

// 渲染markdown
export function renderMarkdown(content) {
  if (!content) return ''
  return md.render(content)
}

// 提取摘要
export function extractSummary(content, maxLength = 200) {
  if (!content) return ''
  
  // 移除markdown语法
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1') // 斜体
    .replace(/`(.*?)`/g, '$1') // 行内代码
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 图片
    .replace(/\n+/g, ' ') // 换行
    .trim()
  
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText
}

// 生成目录
export function generateToc(content) {
  if (!content) return []
  
  const tokens = md.parse(content, {})
  const toc = []
  
  tokens.forEach(token => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.substring(1))
      const next = tokens[tokens.indexOf(token) + 1]
      const content = next ? next.content : ''
      const anchor = content.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      
      toc.push({
        level,
        content,
        anchor
      })
    }
  })
  
  return toc
}
