# Low-Code
字节跳动青训营结营大项目Low-Code

技术栈：

- Vue 3
- TypeScript
- Vite
- Element Plus

## 项目目录结构
```
Low-Code  
│  .gitignore  
│  auto-imports.d.ts  
│  components.d.ts  
│  index.html  
│  list.txt  
│  package-lock.json  
│  package.json  
│  README.md  
│  tsconfig.json  
│  tsconfig.node.json  
│  vite.config.ts  
│    
├─public  
│      vite.svg  
│        
└─src  
    │  App.vue  
    │  main.ts  
    │  style.css  
    │  vite-env.d.ts  
    │    
    ├─assets    // 静态资源文件夹  
    │  │  logo.png  
    │  │    
    │  └─css  
    │          base.css // 全局基础样式  
    │          dark.css // 黑夜模式的样式可以在这里修改  
    │          icon.css // 图标库 iconfont 的图标样式文件  
    │            
    ├─components  
    │  │  index.ts  // 组件的入口文件，在这里将全部组件导出  
    │  │    
    │  ├─ComponentList  // 组件列表  
    │  │      ComponentList.tsx  
    │  │        
    │  ├─EditCanvas // 编辑画布  
    │  │      EditCanvas.css  
    │  │      EditCanvas.min.css  
    │  │      EditCanvas.scss  
    │  │      EditCanvas.tsx  
    │  │        
    │  └─Element // 画布元素  
    │          Element.tsx  
    │            
    ├─interface // TS 接口定义  
    │      index.ts  
    │        
    ├─router    // 路由  
    │      index.ts  
    │        
    ├─store // pinia 状态管理  
    │      canvas.ts    // 画布数据  
    │      elements.ts  // 画布内元素数据  
    │      index.ts  
    │        
    ├─utils // 工具类函数  
    │      bus.ts   // 用于组件通信的 bus  
    │      registerComponent.tsx    // 注册组件  
    │        
    └─views // 页面  
            HomePage.vue    // 主页  
```
## 功能点进展

- 顶部工具栏样式
- 左侧组件列表样式及拖拽功能
- 中间画布样式及渲染功能
- 右侧属性设置样式
- 清空画布功能
- 设置画布属性
- 主题切换/昼夜模式

## 示例图片

### 白昼模式
![image.png](https://s2.loli.net/2022/08/14/5YaV2oyI9FrSbzA.png)

### 黑夜模式
![image.png](https://s2.loli.net/2022/08/14/f1TGVaEx8yvWz6R.png)
