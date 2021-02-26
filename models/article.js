const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slug');
const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');

const dompurify = createDomPurifier(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHTML: {
    type: String,
    required: true
  }
})

// 给 document 定义一个前置钩子 .pre('methodName', fn() {...}) 用于文档更新或保存期间对输入值进行验证
// 每次 document 执行相应的操作 methodName 之前先运行预设的函数
// 示例在文档创建（validate 阶段之前）时执行预设的函数
articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    })
  }
  if (this.markdown) {
    this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
  }
  next()
})

module.exports = mongoose.model('Article', articleSchema);