import MarkdownIt from 'markdown-it'
import MarkdownItKatex from '@iktakahiro/markdown-it-katex'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import MarkdownItTaskLists from 'markdown-it-task-lists'

const markdownIt = new MarkdownIt({
  html: true
})

markdownIt.use(MarkdownItKatex)
markdownIt.use(markdownItTocAndAnchor, {
  anchorLink: false
})
markdownIt.use(MarkdownItTaskLists, {
  label: true, labelAfter: true
})

export default markdownIt
