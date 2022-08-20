import { computed, defineComponent, ref, StyleValue } from 'vue'
import type { Ref } from 'vue'
import { Element } from '../'
import { useCanvasStore, useElementsStore } from '@/store'
import './EditCanvas.scss'
import emitter from '@/utils/bus'
import useMove from '@/utils/useMove'
import type { ElementItem, CanvasStore, ElementsStore, Pos } from '@/interface'

export default defineComponent({
    setup() {
        // 处理数据
        let canvas: CanvasStore = useCanvasStore()
        let elements: ElementsStore = useElementsStore()
        let elementsList: Array<ElementItem> = elements.elements
        // 对齐线
        let snapline: Ref<Pos> = ref({
            X: null,
            Y: null
        })
        // 是否处于移动状态
        let isMove: Ref<boolean> = ref(false)

        // 画布的样式
        const canvasStyle = computed(() => ({
            width: canvas.width + 'px',
            height: canvas.height + 'px',
            backgroundColor: canvas.bgColor,
            backgroundImage: 'linear-gradient(90deg, rgba(60, 10, 30, .04) 3%, transparent 0), linear-gradient(1turn, rgba(60, 10, 30, .04) 3%, transparent 0)',
            backgroundSize: '20px 20px',
            backgroundPosition: '50%',
            backgroundRepeat: 'repeat'
        }))

        // 提供画布的 ref
        const contentRef: Ref<any> = ref()
        emitter.emit("event", contentRef)

        // 引入移动函数
        const { elementMouseDown, elementMouseUp } = useMove(elements, canvas, snapline, isMove)

        // 生成模板
        return () => (
            <div class="canvas-block">
                <div class="element-content"
                    style={canvasStyle.value as StyleValue}
                    ref={contentRef}
                    // @ts-ignore
                    onmousedown={elements.clearFocus}>
                    {
                        (elementsList.map(item => 
                            <Element
                                class={item.focus ? 'element-focus' : ''}
                                data={item}
                                // @ts-ignore
                                draggable
                                onmousedown={(e) => elementMouseDown(e, item)}
                                onmouseup={(e) => elementMouseUp(e, item)}
                            ></Element>
                        ))
                    }
                    {isMove.value && snapline.value.X !== null && <div class='line-x' style={{ left: `${snapline.value.X}px` }}></div>}
                    {isMove.value && snapline.value.Y !== null && <div class='line-y' style={{ top: `${snapline.value.Y}px` }}></div>}
                </div>
            </div>
        )
    }
})