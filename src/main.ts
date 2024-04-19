import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import './assets/main.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'

const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue)
app.use(router)
app.use(ToastService)
app.use(pinia)
app.mount('#app')
