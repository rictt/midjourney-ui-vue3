import { createApp } from 'vue'
import './styles'
import App from './App.vue'
import LazyPlugin from 'vue3-lazy'
// import LoadingImage from '/src/assets/image.png'
import LoadingImage from '/src/assets/icon_loading.png'

createApp(App)
  .use(LazyPlugin, {
    loading: LoadingImage,
    error: LoadingImage,
  })
  .mount('#app')
