import './assets/main.css'

import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const app = createApp(App)

// Install the plugin with the QueryClient instance
app.use(VueQueryPlugin, {
  queryClient,
})

app.use(router)
app.mount('#app')
