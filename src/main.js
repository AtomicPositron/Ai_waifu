import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import VueAutoscroll from '@codekraft-studio/vue-autoscroll'
import { inject } from '@vercel/analytics';
 
inject();
const app = createApp(App)
app.use(VueAutoscroll)
app.mount('#app')
