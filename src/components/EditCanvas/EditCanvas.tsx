import { computed, defineComponent, ref } from 'vue'
import type { Ref } from 'vue'
import { EditData, Canvas, ElementItem } from '../../interface'
import type { PropType } from 'vue'
import { Element } from '../'
import { useCanvasStore, useElementsStore } from '@/store'
import './EditCanvas.scss'
import emitter from '../../utils/bus'

interface Position {
    X: number,
    Y: number,
    Pos?: {
        top: number,
        left: number
    }[]
}

export default defineComponent({
    setup() {
        // 处理数据
        let canvas = useCanvasStore()
        let elements = useElementsStore()
        let elementsList: Array<ElementItem> = elements.elements

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

        // 位置信息
        let startDrag: Position = {
            X: 0,
            Y: 0
        }

        // 选中元素信息
        let focusElements: Array<ElementItem> = []

        // 移动鼠标
        const mouseMove = (e) => {
            let { clientX: moveX, clientY: moveY } = e
            let durX: number = moveX - startDrag.X
            let durY: number = moveY - startDrag.Y

            elements.move(durX, durY, focusElements, startDrag.Pos)
        }

        // 移动鼠标
        const mouseUp = (e) => {
            // 解除移动事件
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('mouseup', mouseUp)
        }

        // 移动鼠标
        const mouseDown = (e) => {
            // 开始拖动位置
            startDrag = {
                X: e.clientX,
                Y: e.clientY,
                Pos: focusElements.map(({top, left}) => ({top, left}))
            }
            console.log('start');
            

            // 注册移动事件
            document.addEventListener('mousemove', mouseMove)
            document.addEventListener('mouseup', mouseUp)
        }

        // 鼠标点击元素
        const elementMouseDown = (e, item) => {
            e.preventDefault()
            e.stopPropagation()

            // 更改元素的选中属性
            if (!e.ctrlKey) {
                let focus = item.focus
                let focusNum = elements.focusNum
                elements.clearFocus()
                
                // 如果当前状态是单选，就取消选中，如果当前状态是多选，就不取消选中
                if (focusNum === 1 && focus) {
                    item.focus = true
                }
            }
            item.focus = !item.focus
            focusElements = elements.focusElements
            mouseDown(e)
        }

        // 生成模板
        return () => (
            <div class="canvas-block">
                <div class="element-content"
                    style={canvasStyle.value}
                    ref={contentRef}
                    onmousedown={elements.clearFocus}>
                    {
                        (elementsList.map(item => 
                            <Element
                                class={item.focus ? 'element-focus' : ''}
                                data={item}
                                draggable
                                onmousedown={(e) => elementMouseDown(e, item)}
                            ></Element>
                        ))
                    }
                </div>
            </div>
        )
    }
})