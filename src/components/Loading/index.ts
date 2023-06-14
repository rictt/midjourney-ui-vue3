import Loading from './index.vue'
import { ComponentPublicInstance, createApp } from 'vue'

type LoadingElementType = HTMLElement & {
  instance: ComponentPublicInstance
}

const append = (el: LoadingElementType) => {
  const style = getComputedStyle(el)
  if (['absolute', 'relative', 'fixed'].indexOf(style.position) === -1) {
    el.classList.add('relative')
  }
  el.appendChild(el.instance.$el)
}
const remove = (el: LoadingElementType) => {
  el.removeChild(el.instance.$el)
  el.classList.remove('relative')
}

export const loadingDirective = {
  mounted(el: any, binding: any) {
    const app = createApp(Loading)
    const container = document.createElement('div')
    const instance = app.mount(container);
    instance.$el

    el.instance = instance

    if (binding.value) {
      append(el)
    }
    if (binding.arg !== 'undefined') {
      el.instance.setTitle(binding.arg)
    }
  },
  updated(el: any, binding: any) {

    if (binding.arg !== 'undefined') {
      // setTitle 使我们在loading组件中定义的⽅法
       el.instance.setTitle(binding.arg)  
     }

    if (binding.value !== binding.oldValue) {
      // 三元表达式 true 插入 false 移除
      binding.value ? append(el) : remove(el)
    }
  }
}

export const useLoading = () => {
  return { ...loadingDirective }
}