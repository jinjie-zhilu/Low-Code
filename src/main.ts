import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import router from './router/index'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/dark.css'

// main.ts 中加入如下代码
const app = createApp(App)
const win: any = window // 
if (process.env.NODE_ENV === 'development') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
    // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
    win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
  }
}

setupStore(app)

app
    .use(router)
    .mount('#app')

