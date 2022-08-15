import { defineStore } from 'pinia'

export const useCanvasStore = defineStore('canvas', {
    state: () => {
        return {
            bgColor: "#fff",
            width: 1080,
            height: 800,
            zoom: 100
        }
    },
    getters: {
        
    },
    actions: {
        
    }
})