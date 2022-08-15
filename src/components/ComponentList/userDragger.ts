import { BaseData } from "@/interface"
import { ref } from 'vue'
import type { Ref } from 'vue'
import emitter from '../../utils/bus'

export default function userDragger(elements, components) {

    // 获取画布ref
    let contentRef: Ref<any> = ref()
    emitter.on("event", e => {
        contentRef = e as Ref<any>
    })

    // 获取当前拖拽元素
    let currentElement: BaseData

    // 开始拖拽
    const dragstart = (e, component) => {        
        // 绑定事件
        contentRef.value.addEventListener('dragener', dragenter)
        contentRef.value.addEventListener('dragover', dragover)
        contentRef.value.addEventListener('dragleave', dragleave)
        contentRef.value.addEventListener('drop', drop)

        currentElement = component
    }

    // 拖拽进入
    const dragenter = (e) => {
        e.dataTransfer.dropEffect = 'move'
    }

    // 拖拽经过
    const dragover = (e) => {
        e.preventDefault()
    }

    // 拖拽离开
    const dragleave = (e) => {
        e.dataTransfer.dropEffect = 'none'
    }

    // 松开
    const drop = (e) => {
        let componentData = components.componentMap[currentElement.key]

        elements.addElement({
            top: e.offsetY,
            left: e.offsetX,
            ...componentData
        })
        currentElement = null
    }

    // 完成拖拽
    const dragend = (e) => {
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