import Modal from './index.vue'
import { createVNode, VNodeTypes, render } from 'vue'

interface IShowModal {
  title?: string;
  visible?: boolean;
  onClose?: () => void;
}
export const showModal = (component: VNodeTypes, props?: IShowModal) => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')

    const vm = createVNode(Modal, {
      title: "使用说明",
      modelValue: true,
      onClose: () => {
        document.body.removeChild(container)
        props?.onClose()
      }
    }, {
      default: () => createVNode(component, {
        close: () => {
          vm.component.exposed.close()
        }
      })
    })

    render(vm, container);
    document.body.appendChild(container)
  })
}