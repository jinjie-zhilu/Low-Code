import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import router from './router/index'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/dark.css'

const app = createApp(App)
setupStore(app)

app
    .use(router)
    .mount('#app')

