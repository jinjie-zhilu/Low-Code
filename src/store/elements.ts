import { defineStore } from 'pinia'
import { ElementItem, ElementsStore } from "@/interface"

export const useElementsStore: () => ElementsStore = defineStore('elements', {  
    state: () => {
        return {
            sum: 0,
            elements: []
        }
    },
    getters: {
        // 获取选中/未选中元素列表
        focusElements(): {
            focus: Array<ElementItem>,
            unfocus: Array<ElementItem>
        } {
            let focus: Array<ElementItem> = []
            let unfocus: Array<ElementItem> = []
            this.elements.forEach(element => (element.focus ? focus : unfocus).push(element))
            return {
                focus,
                unfocus
            }
        }
    },
    actions: {
        // 添加元素
        addElement(component: ElementItem): void {
            this.elements.push({
                id: this.sum,
                ...component
            })
            this.sum++
        },
        // 清空元素
        clearAll(): void {
            this.sum = 0
            this.elements.splice(0, this.elements.length)
        },
        // 清空元素 focus 状态
        clearFocus(): void {
            this.elements.forEach(item => item.focus = false)
        },
        // 移动元素
        move(X: number, Y: number, focus: Array<ElementItem>, Pos: { top: number, left: number }[]): void {
            focus.map((element, index) => {
                element.top = Pos[index].top + Y
                element.left = Pos[index].left + X
            })
        },
        // 设置元素
        set(elements: Array<ElementItem>) {
            this.clearAll()
            elements.forEach((item) => {
                this.addElement(item)
            })
        }
    }
})