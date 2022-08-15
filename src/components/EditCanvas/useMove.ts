import throttle from '@/utils/throttle'
import { ElementItem } from '../../interface'

interface Position {
    X: number,
    Y: number,
    Pos?: {
        top: number,
        left: number
    }[]
}

export default function userMove(elements) {
    // 位置信息
    let startDrag: Position = {
        X: 0,
        Y: 0
    }
    let isMove: boolean
    let rawFocus: boolean

    // 选中元素信息
    let focusElements: Array<ElementItem> = []

    // 移动鼠标
    const mouseMove = throttle((e) => {
        // 记录移动位置
        let { clientX: moveX, clientY: moveY } = e
        let durX: number = moveX - startDrag.X
        let durY: number = moveY - startDrag.Y

        // 移动元素
        elements.move(durX, durY, focusElements, startDrag.Pos)
        isMove = true
    }, 20)

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
            Pos: focusElements.map(({ top, left }) => ({ top, left }))
        }

        // 注册移动事件
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }

    // 鼠标按下元素
    const elementMouseDown = (e, item) => {
        // 屏蔽点击事件
        e.preventDefault()
        e.stopPropagation()

        // 是否移动置否
        isMove = false
        // 原始选中状态
        rawFocus = item.focus

        // 当前选中有非自身元素且没有按下 Ctrl 键时清空 focus
        if (focusElements.length && !rawFocus && !e.ctrlKey) {
            elements.clearFocus()
        }
        item.focus = true
        focusElements = elements.focusElements
        // 拖拽
        mouseDown(e)
    }

    // 鼠标放开元素
    const elementMouseUp = (e, item) => {
        // 移动不改变选中状态
        if (isMove) {
            return
        }

        // 当前选中有非自身元素且没有按下 Ctrl 键时清空 focus
        if (focusElements.length && !rawFocus && !e.ctrlKey) {
            elements.clearFocus()
        }
        item.focus = !rawFocus
        focusElements = elements.focusElements
    }

    return {
        elementMouseDown,
        elementMouseUp
    }
}