import { computed, inject } from 'vue'
import { ComponentRegisty, ElementItem } from '@/interface'

export function renderElement(data: ElementItem, elementMouseDown: Function, elementMouseUp: Function) {

    // 元素的样式
    const elementStyle = computed(() => ({
        top: `${data.top}px`,
        left: `${data.left}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
        zIndex: data.zIndex,
        fontSize: `${data.fontSize}px`,
        color: data.color,
        img: data.img,
        video: data.video
    }))

    // 获取组件信息
    let components: ComponentRegisty = inject('components')

    // 获取组件的 render
    const renderComponent = components.componentMap[data.key].render(data)

    // 生成模板
    return (
        <div
            class={'element-item' + (data.focus ? ' element-focus' : '')}
            style={elementStyle.value}
            // @ts-ignore
            draggable
            // @ts-ignore
            onmousedown={(e) => elementMouseDown(e, data)}
            // @ts-ignore
            onmouseup={(e) => elementMouseUp(e, data)}
        >
            {renderComponent}
        </div>
    )
}