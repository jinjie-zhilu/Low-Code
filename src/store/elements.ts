import { defineStore } from 'pinia'
import { ElementItem } from "@/interface"

export const useElementsStore = defineStore('elements', {  
    state: () => {
        return {
            sum: 0,
            elements: []
        }
    },
    getters: {
        // 获取选中元素列表
        focusElements(): Array<ElementItem> {
            let focus = []
            let unfocus = []
            this.elements.forEach(element => (element.focus ? focus : unfocus).push(element))
            return focus
        }
    },
    actions: {
        // 添加元素
        addElement(component: ElementItem): void {
            this.elements.push({
                id: this.num,
                ...component
            })
            this.num++
        },
        // 清空元素
        clearAll(): void {
            this.num = 0
            this.elements.splice(0, this.elements.length)
        },
        // 清空元素 focus 状态
        clearFocus(): void {
            this.elements.forEach(item => item.focus = false)
        },
        // 移动元素
        move(X: number, Y: number, focus: Array<ElementItem>, Pos: {top: number, left: number}[]): void {
            focus.map((element, index) => {
                element.top = Pos[index].top + Y
                element.left = Pos[index].left + X
            })
        }
    }
})