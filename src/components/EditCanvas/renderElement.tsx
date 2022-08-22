import { computed, inject } from 'vue'
import { ComponentRegisty, ElementItem } from '@/interface'

export function renderElement(state: string, data: ElementItem, elementMouseDown: Function, elementMouseUp: Function) {

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
        video: data.video,
        inputType: data.inputType,
        lineColor: data.lineColor,
        borderRadius: data.borderRadius,
        muted: data.muted,
        autoplay: data.autoplay,
        loop: data.loop,
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
            draggable={state === 'edit'}
            // @ts-ignore
            onmousedown={(e) => { state === 'edit' ? elementMouseDown(e, data) : null }}
            // @ts-ignore
            onmouseup={(e) => { state === 'edit' ? elementMouseUp(e, data) : null } }
        >
            {renderComponent}
        </div>
    ) 
}