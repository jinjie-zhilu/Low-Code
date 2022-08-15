import { defineStore } from 'pinia'

export const elementsStore = defineStore('elements', {
    state: () => {
        return {
            sum: 0,
            elements: []
        }
    },
    getters: {

    },
    actions: {
        // 添加元素
        addElement(component): void {
            this.elements.push({
                id: this.num,
                ...component
            })
            this.num++
        },
        // 清空元素
        clearAll() {
            this.num = 0
            this.elements.splice(0,this.elements.length)
            
        }
    }
})