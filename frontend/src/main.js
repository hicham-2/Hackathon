// import './assets/main.css'

// import { createPinia } from 'pinia'
// import { createApp } from 'vue'

// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')



import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import router from './router'

createApp(App).use(router).mount('#app')
