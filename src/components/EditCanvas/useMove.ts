import { Pos } from '@/interface/data'
import throttle from '@/utils/throttle'
import { Ref } from 'vue'
import { ElementItem, ElementsStore } from '../../interface'

interface Lines {
    X: Array < {
        show: number,
        left: number
    }>,
    Y: Array < {
        show: number,
        top: number
    }>
}

interface DragState {
    X: number,
    Y: number,
    originTop?: number,
    originLeft?: number,
    Pos?: {
        top: number,
        left: number
    }[],
    lines?: Lines
}

export default function userMove(
    elements: ElementsStore,
    snapline: Ref<{
        X: number,
        Y: number
    }>,
    isMove: Ref<boolean>): { elementMouseDown: Function, elementMouseUp: Function } {

    // 位置信息
    let dragState: DragState = {
        X: 0,
        Y: 0
    }
    let rawFocus: boolean

    // 选中元素信息
    let focusElements: Array<ElementItem> = []

    // 获取选中元素块信息
    const focusInfo = () => {
        if (!focusElements.length) {
            return
        }
        let minTop: number = focusElements[0].top
        let minLeft: number = focusElements[0].left
        let maxBottom: number = focusElements[0].top + focusElements[0].height
        let maxRight: number = focusElements[0].left + focusElements[0].width

        focusElements.forEach((element) => {
            if (element.top < minTop)
                minTop = element.top
            if (element.left < minLeft)
                minLeft = element.left
            if (element.top + element.height > maxBottom)
                maxBottom = element.top + element.height
            if (element.left + element.width > maxRight)
                maxRight = element.left + element.width
        })

        return {
            minTop,
            minLeft,
            maxHeight: maxBottom - minTop,
            maxWidth: maxRight - minLeft
        }
    }

    // 计算对齐线
    const calcSnapline: (dur: Pos) => void = throttle((dur: Pos) => {
        // 记录选中块的位置
        const {
            minTop: originTop,
            minLeft: originLeft
        } = focusInfo()

        snapline.value.X = null
        snapline.value.Y = null

        for (let i = 0; i < dragState.lines.X.length; i++) {
            const { show: showX, left } = dragState.lines.X[i]
            const { show: showY, top } = dragState.lines.Y[i]
            let difX: number = left - originLeft
            let difY: number = top - originTop
            if (Math.abs(difX) < 6) {
                snapline.value.X = showX
                dur.X = left - dragState.originLeft
            }
            if (Math.abs(difY) < 6) {
                snapline.value.Y = showY
                dur.Y = top - dragState.originTop
            }
            if (snapline.value.X !== null || snapline.value.Y !== null) {
                break
            }
        }

        // 移动元素
        elements.move(dur.X, dur.Y, focusElements, dragState.Pos)
    }, 50)

    // 移动鼠标
    const mouseMove = throttle((e) => {
        // 记录移动位置
        let { clientX: moveX, clientY: moveY } = e
        let dur: Pos = {
            X: moveX - dragState.X,
            Y: moveY - dragState.Y
        }

        // 计算对齐线
        calcSnapline(dur)

        // 移动元素
        elements.move(dur.X, dur.Y, focusElements, dragState.Pos)

        isMove.value = true
    }, 20)

    // 鼠标抬起
    const mouseUp = (e) => {
        // 移动状态置否
        isMove.value = false

        // 记录移动位置
        let { clientX: moveX, clientY: moveY } = e
        let dur: Pos = {
            X: moveX - dragState.X,
            Y: moveY - dragState.Y
        }

        // 计算对齐线
        calcSnapline(dur)

        // 解除移动事件
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
    }

    // 鼠标按下
    const mouseDown = (e) => {
        // 记录选中块的位置
        const {
            minTop: originTop,
            minLeft: originLeft,
            maxHeight: originH,
            maxWidth: originW
        } = focusInfo()

        // 准备拖动状态数据
        dragState = {
            X: e.clientX,
            Y: e.clientY,
            originTop: originTop,
            originLeft: originLeft,
            Pos: focusElements.map(({ top, left }) => ({ top, left })),
            lines: (() => {
                const unfocus: Array<ElementItem> = elements.focusElements.unfocus

                let lines: Lines = {
                    X: [],
                    Y: []
                }

                unfocus.forEach((element) => {
                    const {
                        top: referTop,
                        left: referLeft,
                        width: referW,
                        height: referH } = element
                    // 垂直对齐线
                    lines.X.push({
                        // 左对左对齐
                        show: referLeft,
                        left: referLeft
                    }, {
                        // 顶对底对齐
                        show: referLeft,
                        left: referLeft - originW
                    }, {
                        // 水平居中对齐
                        show: referLeft + referW / 2,
                        left: referLeft + referW / 2 - originW / 2
                    }, {
                        // 底对顶对齐
                        show: referLeft + referW,
                        left: referLeft + referW
                    }, {
                        // 底对底对齐
                        show: referLeft + referW,
                        left: referLeft + referW - originW
                    })
                    // 水平对齐线
                    lines.Y.push({
                        // 顶对顶对齐
                        show: referTop,
                        top: referTop
                    }, {
                        // 顶对底对齐
                        show: referTop,
                        top: referTop - originH
                    }, {
                        // 水平居中对齐
                        show: referTop + referH / 2,
                        top: referTop + referH / 2 - originH / 2
                    }, {
                        // 底对顶对齐
                        show: referTop + referH,
                        top: referTop + referH
                    }, {
                        // 底对底对齐
                        show: referTop + referH,
                        top: referTop + referH - originH
                    })
                })

                return lines
            })()
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

        // 移动状态置否
        isMove.value = false

        // 原始选中状态
        rawFocus = item.focus

        // 当前选中有非自身元素且没有按下 Ctrl 键时清空 focus
        if (focusElements.length && !rawFocus && !e.ctrlKey) {
            elements.clearFocus()
        }
        item.focus = true
        focusElements = elements.focusElements.focus
        // 拖拽
        mouseDown(e)
    }

    // 鼠标放开元素
    const elementMouseUp = (e, item) => {
        // 移动不改变选中状态
        if (isMove.value) {
            return
        }

        // 当前选中有非自身元素且没有按下 Ctrl 键时清空 focus
        if (focusElements.length && !rawFocus && !e.ctrlKey) {
            elements.clearFocus()
        }
        item.focus = !rawFocus
        focusElements = elements.focusElements.focus
    }

    return {
        elementMouseDown,
        elementMouseUp
    }
}