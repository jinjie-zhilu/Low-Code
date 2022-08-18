import { defineStore } from 'pinia'

export const useCanvasStore = defineStore('canvas', {
    state: () => {
        return {
            bgColor: "#fff",
            width: 800,
            height: 520,
            zoom: 100
        }
    },
    getters: {
        
    },
    actions: {
        
    }
})