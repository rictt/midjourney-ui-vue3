import { createVNode, render } from 'vue'
import toastTemplate from './index.vue'

export interface IProps {
  value?: string;
  duration?: number;
  background?: string;
  color?: string;
}
const defaultOpt = { // 创建默认参数
  duration: 3000
}

export interface ResultParams {
  destory?: () => void;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Toast = (options: IProps): ResultParams => {
  const container = document.createElement('div')
  const opt = { ...defaultOpt, ...options }
  const vm = createVNode(toastTemplate, opt) // 创建vNode
  render(vm, container)
  document.body.appendChild(container)       // 添加到body上
  const destory = () => {
    const dom = vm.el as HTMLDivElement
    if (dom.querySelector('.toast-value')) {
      dom.querySelector('.toast-value')?.classList.add('reomve') // 销毁时添加淡入淡出效果
      const t = setTimeout(() => {             // 淡入淡出效果之后删除dom节点
        render(null, container)
        document.body.removeChild(container)
        clearTimeout(t)
      }, 500);
    }
  }
  if (opt.duration) {                            // 如果传入的值为0可以持续保留在页面，需要手动销毁
    const timer = setTimeout(() => {
      destory()
      clearTimeout(timer)
    }, opt.duration)
  }
  return {
    destory
  }
}
export default Toast
