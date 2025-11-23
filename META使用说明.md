# Meta管理使用说明

## 概述

本项目提供了完整的SEO meta管理解决方案，包括：

- 静态meta标签（在index.html中）
- 动态meta管理（使用VueUse和自定义工具）
- 页面级meta配置
- 路由级meta自动管理

## 文件结构

```
src/
├── utils/
│   └── meta.ts          # Meta管理工具
├── views/
│   └── Today.vue        # 使用示例
└── ...
public/
├── robots.txt           # 搜索引擎爬虫规则
└── index.html          # 基础meta配置
```

## 使用方法

### 1. 在组件中使用

```vue
<script setup lang="ts">
import { usePageMeta } from '@/utils/meta'

// 使用动态meta管理
usePageMeta({
  title: '页面标题',
  description: '页面描述',
  keywords: '关键词1,关键词2',
  image: '/custom-image.png', // 可选
  url: '/custom-path', // 可选
})
</script>
```

### 2. 在路由中使用

```typescript
import { setupRouteMeta } from '@/utils/meta'

// 在路由守卫中调用
router.beforeEach((to, from) => {
  setupRouteMeta(to, from)
  // 其他路由逻辑...
})
```

### 3. 预定义页面配置

工具已经预定义了所有主要页面的meta配置：

- `/` - 首页
- `/today` - 今日日程
- `/calendar` - 日历视图
- `/habits` - 习惯管理
- `/flow` - 任务流程
- `/schedule-list` - 日程列表
- `/about` - 关于我们
- `/login` - 登录页面
- `/register` - 注册页面
- `/setting` - 设置页面

### 4. 自定义页面配置

如果需要添加新的页面配置，在 `src/utils/meta.ts` 中的 `pageMetaConfig` 对象中添加：

```typescript
export const pageMetaConfig: Record<string, PageMeta> = {
  // ... 现有配置
  '/new-page': {
    title: '新页面 - 智能日程管理',
    description: '新页面的描述信息',
    keywords: '新页面,相关关键词',
  },
}
```

## Meta标签类型

### 基础Meta标签

- `title` - 页面标题
- `description` - 页面描述
- `keywords` - 关键词
- `author` - 作者信息
- `robots` - 搜索引擎索引规则

### Open Graph Meta标签

- `og:title` - 社交媒体分享标题
- `og:description` - 社交媒体分享描述
- `og:type` - 内容类型
- `og:url` - 页面URL
- `og:image` - 分享图片

### Twitter Card Meta标签

- `twitter:card` - 卡片类型
- `twitter:title` - Twitter分享标题
- `twitter:description` - Twitter分享描述
- `twitter:image` - Twitter分享图片

## 部署注意事项

1. **更新域名**：在部署到生产环境时，请更新以下文件中的域名：
   - `public/index.html` 中的 `og:url`、`canonical` 链接
   - `public/robots.txt` 中的 `Sitemap` 位置

2. **生成Sitemap**：建议为生产环境生成XML网站地图

3. **验证Meta标签**：使用Google Search Console等工具验证meta标签是否正确设置

## 技术实现

- 使用 `@vueuse/core` 的 `useTitle` 管理页面标题
- 使用原生DOM操作动态更新meta标签
- 支持SSR兼容（通过条件判断）
- TypeScript类型安全

## 最佳实践

1. **保持描述简洁**：描述控制在150-160字符以内
2. **关键词相关**：使用与页面内容相关的关键词
3. **图片优化**：使用高质量的分享图片
4. **URL规范**：使用规范的URL格式
