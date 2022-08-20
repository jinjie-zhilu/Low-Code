import { defineComponent, inject } from 'vue'
import { useElementsStore } from '@/store'
import { ElDivider } from 'element-plus'
import useDragger from '@/utils/useDragger'
import type { ComponentRegisty, ElementItem, ElementsStore } from '@/interface'

export default defineComponent({
    setup() {
        // 获取 store
        let elements: ElementsStore = useElementsStore()

        // 获取组件列表
        let components: ComponentRegisty = inject('components')
        const componentList: Array<ElementItem> = components.componentList

        // 拖拽进入画布逻辑
        const { dragstart, dragend } = useDragger(elements, components)

        // 生成模板
        return () => (
            <div class="component-box">
                <h3>组件列表</h3>   
                <ElDivider></ElDivider>
                <div class="component-list">
                    {
                        componentList.map(item => (
                            <div
                                class="component-item"
                                draggable
                                onDragstart={e => dragstart(e, item)}
                                onDragend={e => dragend(e)}
                            >
                                <i class={'iconfont icon-' + item.key}></i>
                                <p>{ item.label }</p>
                            </div>
                        ))
                    }
                </div >
            </div>
        )
    }
})