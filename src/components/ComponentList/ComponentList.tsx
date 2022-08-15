import { defineComponent, inject } from 'vue'
import { ComponentInfo, BaseData } from '../../interface'
import { useElementsStore } from '../../store/elements'
import { ElDivider } from 'element-plus'
import useDragger from './useDragger'

export default defineComponent({
    setup() {
        // 获取 store
        let elements = useElementsStore()

        // 获取组件列表
        let components: ComponentInfo = inject('components')
        const componentList: Array<BaseData> = components.componentList

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