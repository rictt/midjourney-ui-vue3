<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { drawStyles } from '../../utils';
import Tag from '../../components/Tag.vue'
import { getSettings, setSettings } from '../../utils/storage'
import Toast from '../Toast';
import { ISettings } from '../../interfaces/global'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  close: {
    type: Function
  }
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)

watch(visible, (value) => {
  emit('update:modelValue', value)
})

watch(() => props.modelValue, (value) => {
  visible.value = value
})

const defaultSettings: ISettings = {
  model: '',
  widthRadio: 1,
  heightRadio: 1,
  seed: '',
  currentStyle: ''
}
const settings = getSettings<ISettings>() || defaultSettings
const form = reactive(settings)

const data = reactive({
  styles: [...drawStyles],
})

const handleChange = (value) => {
  form.model = value
}

const onClickSave = () => {
  setSettings(form)
  Toast({ value: "保存成功" })
  setTimeout(() => {
    props.close?.()
  }, 500)
}
const onClickCancel = () => {
  props.close?.()
}

</script>

<template>
  <div class="max-w-[600px]">
    <div class="px-2 py-2 leading-8">
      <div class="flex flex-row items-center">
        <div class="w-[10px] h-[10px] bg-orange-500 mr-2"></div>
        <div class="text-md text-white">模型</div>
      </div>
      <div class="text-md text-gray-200">这里只支持v5.1和niji模型的快速配置，如使用其他模型，需要自己编写指令参数</div>
      <div class="flex flex-row">
        <label for="r1" class="inline-flex items-center pr-4">
          <input @change="handleChange('v5.1')" :checked="form.model === 'v5.1'" id="r1" type="radio" class="mr-1 appearance-none w-[12px] h-[12px] rounded-full bg-white checked:bg-orange-500" />
          <span>v5.1</span>
        </label>
        <label for="r2" class="inline-flex items-center">
          <input @change="handleChange('niji')" :checked="form.model === 'niji'" id="r2" type="radio" class="mr-1 appearance-none w-[12px] h-[12px] rounded-full bg-white checked:bg-orange-500" />
          <span>niji</span>
        </label>
      </div>
    </div>
  
    <div class="px-2 py-2 leading-8">
      <div class="flex flex-row items-center">
        <div class="w-[10px] h-[10px] bg-orange-500 mr-2"></div>
        <div class="text-md text-white">图片比例</div>
      </div>
      <div class="text-md text-gray-200">支持1:2和2:1之间的比例，例如2:3, 9:16，默认为1:1</div>
      <div class="flex flex-row">
        <input v-model="form.widthRadio" class="max-w-[45%] text-center text-gray-500 outline-none px-2 rounded" />
        <span class="pl-2 pr-1">：</span>
        <input v-model="form.heightRadio" class="max-w-[45%] text-center text-gray-500 outline-none px-2 rounded" />
      </div>
    </div>
  
    <div class="px-2 py-2 leading-8">
      <div class="flex flex-row items-center">
        <div class="w-[10px] h-[10px] bg-orange-500 mr-2"></div>
        <div class="text-md text-white">图片种子</div>
      </div>
      <div class="text-md text-gray-200">设定种子后，相同的描述，会生成相似的图片，范围0～4294967295，默认为空，每次提交自动随机生成</div>
      <div class="flex flex-row">
        <input v-model="form.seed" class="text-center text-gray-500 outline-none px-2 rounded" />
      </div>
    </div>

    <div class="px-2 py-2 leading-8">
      <div class="flex flex-row items-center">
        <div class="w-[10px] h-[10px] bg-orange-500 mr-2"></div>
        <div class="text-md text-white">风格</div>
      </div>
      <div class="text-md text-gray-200">绘制对应风格的图片，默认为空，根据描述生成</div>
      <!-- 风格区域 -->
      <div class="flex flex-row text-orange-400 items-center flex-wrap bg-white rounded py-2 px-1">
        <Tag :type="form.currentStyle === item.value ? 'primary' : 'plain'" @click="form.currentStyle = item.value" size="medium" v-for="(item, index) in data.styles" :key="index">{{ item.label }}</Tag>
      </div>
    </div>

    <div class="flex flex-row justify-end text-right py-4">
      <div class="px-4 py-2 cursor-pointer rounded text-gray mr-4" @click="onClickCancel">取消</div>
      <div class="px-4 py-2 cursor-pointer rounded text-gray bg-orange-500 hover:bg-orange-600" @click="onClickSave">保存</div>
    </div>
  </div>
</template>