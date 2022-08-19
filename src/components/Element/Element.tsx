import { computed, defineComponent, inject } from 'vue'
import { ComponentRegisty, ElementItem } from '../../interface'
import type { PropType } from 'vue'

export default defineComponent({
    props: {
        data: { type: Object as PropType<ElementItem> }
    },
    setup(props) {
        // 处理数据
        let data: ElementItem = props.data
        
        // 元素的样式
        const elementStyle = computed(() => ({
            top: `${data.top}px`,
            left: `${data.left}px`,
            width: `${data.width}px`,
            height: `${data.height}px`,
            zIndex: data.zIndex,
            fontSize: `${data.fontSize}px`,
            color: data.color
        }))

        // 获取组件信息
        let components: ComponentRegisty = inject('components')
        
        // 获取组件的 render
        const renderComponent = components.componentMap[data.key].render(data)
        
        // 生成模板
        return () => (
            <div class="element-item" style={elementStyle.value}>
                {renderComponent}
            </div>
        )
    }
})