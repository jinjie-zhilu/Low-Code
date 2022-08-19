import { ElementItem, ComponentRegisty } from "@/interface"
import { ref } from 'vue'
import type { Ref } from 'vue'
import emitter from './bus'

export default function userDragger(elements, components: ComponentRegisty) {

    // 获取画布ref
    let contentRef: Ref<any> = ref()
    emitter.on("event", e => {
        contentRef = e as Ref<any>
    })

    // 获取当前拖拽元素
    let currentElement: ElementItem

    // 开始拖拽
    const dragstart = (e: DragEvent, element: ElementItem) => {
        // 绑定事件
        contentRef.value.addEventListener('dragener', dragenter)
        contentRef.value.addEventListener('dragover', dragover)
        contentRef.value.addEventListener('dragleave', dragleave)
        contentRef.value.addEventListener('drop', drop)

        currentElement = element
        
        // 发布拖拽开始事件
        emitter.emit('actionStart')
    }

    // 拖拽进入
    const dragenter = (e: DragEvent) => {
        e.dataTransfer.dropEffect = 'move'
    }

    // 拖拽经过
    const dragover = (e: DragEvent) => {
        e.preventDefault()
    }

    // 拖拽离开
    const dragleave = (e: DragEvent) => {
        e.dataTransfer.dropEffect = 'none'
    }

    // 松开
    const drop = (e: DragEvent) => {
        let componentData = components.componentMap[currentElement.key]
        
        elements.addElement({
            top: e.offsetY - componentData.height / 2,
            left: e.offsetX - componentData.width / 2,
            ...componentData
        })
        currentElement = null

        // 发布拖拽结束事件
        emitter.emit('actionEnd')
    }

    // 完成拖拽
    const dragend = (e: DragEvent) => {
        // 解除绑定事件
        contentRef.value.removeEventListener('dragener', dragenter)
        contentRef.value.removeEventListener('dragover', dragover)
        contentRef.value.removeEventListener('dragleave', dragleave)
        contentRef.value.removeEventListener('drop', drop)
    }

    return {
        dragstart,
        dragend
    }
}