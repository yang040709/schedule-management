import 'vue-router'

// 声明你要的 meta 类型
declare module 'vue-router' {
  interface RouteMeta {
    // 可选字段示例
    title?: string
    // requiresAuth?: boolean;
    // keepAlive?: boolean;
    // layout?: 'default' | 'blank';
    // 你可以根据项目需要添加更多字段
  }
}
