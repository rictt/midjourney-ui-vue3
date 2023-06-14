import { createApp } from 'vue'
import './styles'
import App from './App.vue'
import LazyPlugin from 'vue3-lazy'
import LoadingImage from '/src/assets/icon_loading.png'
import ErrorImage from '/src/assets/icon_error.png'
import { loadingDirective } from './components/Loading'

createApp(App)
  .use(LazyPlugin, {
    loading: LoadingImage,
    error: ErrorImage,
  })
  .directive('loading', loadingDirective)
  .mount('#app')
