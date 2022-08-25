import { computed, inject } from 'vue'
import { ComponentRegisty, ElementItem, ElementsStore } from '@/interface'
import { useElementsStore } from '@/store'
import { Action, ElMessage, ElMessageBox } from 'element-plus'

export function renderElement(state: string, data: ElementItem) {

    // 元素的样式
    const elementStyle = computed(() => ({
        top: `${data.top}px`,
        left: `${data.left}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
        zIndex: data.zIndex,
        fontSize: `${data.fontSize}px`,
        fontFamily: data.fontFamily,
        color: data.color,
        img: data.img,
        video: data.video,
        inputType: data.inputType,
        background: data.background,
        borderRadius: data.borderRadius,
        muted: data.muted,
        autoplay: data.autoplay,
        loop: data.loop,
    }))

    let elements: ElementsStore = useElementsStore()

    // 获取组件信息
    let components: ComponentRegisty = inject('components')

    // 获取组件的 render
    const renderComponent = components.componentMap[data.key].render(data)

    // 获取组件触发事件
    let eventsObj = {
        click: null,
        mouseenter: null
    }
    const elementEvents: Array<string> = data.event.split(',')    
    elementEvents.forEach(item => {
        if (item === '')
            return
        let params: Array<string> = item.split('(')
        let event: string = params[0]
        let action: string = params[1]
        let content: string = elements.processString(params[2].split('))')[0])
        
        if (action === 'href') {
            eventsObj[event] = () => {
                window.open(content)
            }
        } else if (action === 'alert') {
            eventsObj[event] = () => ElMessageBox.alert(content, 'Tips', {
                confirmButtonText: 'OK',
            })
        }
        
    })

    // 生成模板
    return (
        <div
            {...{
                onClick: eventsObj.click,
                onMouseenter: eventsObj.mouseenter
            }}
            class={'element-item' + (data.focus ? ' element-focus' : '')}
            style={elementStyle.value}
        >
            {renderComponent}
        </div>
    ) 
}