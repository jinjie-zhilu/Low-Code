import { defineStore } from 'pinia'
import type { ElementItem, ElementsStore } from "@/interface"
import { deepcopy } from '@/utils/deepcopy'

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
        // 设置元素属性
        set(elements: Array<ElementItem>): void {
            this.clearAll()
            elements.forEach((item) => {
                this.addElement(item)
            })
        },
        // 删除元素
        delete(elements: Array<ElementItem>): void {
            elements.forEach((item) => {
                let index: number = 0
                this.elements.forEach((element, idx) => {
                    console.log(index)
                    if (element.id == item.id) 
                        index = idx
                })

                let temp = deepcopy(this.elements)
                let deltemp = temp.splice(index, 1)
                this.$patch({
                    sum: this.sum,
                    elements: temp
                })
                console.log(this.elements, deltemp, temp)
            })
        }
    }
})