import { computed, ComputedRef, defineComponent, ref, StyleValue } from 'vue'
import type { Ref } from 'vue'
import '../EditCanvas/EditCanvas.scss'
import type { ElementItem, Pos, Canvas } from '@/interface'
import { renderElement } from './renderElement'

export default defineComponent({
    props: {
        data: {
            type: Object
        }
    },
    setup(props) {
        // 处理数据
        let { canvas, elements } = props.data
        
        // 对齐线
        let snapline: Ref<Pos> = ref({
            X: null,
            Y: null
        })

        // 是否处于移动状态
        let isMove: Ref<boolean> = ref(false)

        // 画布的样式
        var canvasStyle = computed(() => ({
            width: canvas.width + 'px',
            height: canvas.height + 'px',
            backgroundColor: canvas.bgColor,
            backgroundSize: '20px 20px',
            backgroundPosition: '50%',
            backgroundRepeat: 'repeat'
        }))

        function CanvasContent(elements: Array<ElementItem>) {
            return (elements.map(item =>
                renderElement('preview', item)
            ))
        }

        // 生成模板
        return () => (
            <div class="canvas-block">
                <div class="element-content preview"                    style={canvasStyle.value as StyleValue}>
                    {
                        CanvasContent(elements)
                    }
                    {isMove.value && snapline.value.X !== null && <div class='line-x' style={{ left: `${snapline.value.X}px` }}></div>}
                    {isMove.value && snapline.value.Y !== null && <div class='line-y' style={{ top: `${snapline.value.Y}px` }}></div>}
                </div>
            </div>
        )
    }
})