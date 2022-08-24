import { PublishStore } from '@/interface'
import { defineStore } from 'pinia'

export const usePublishStore: () => PublishStore = defineStore('publish', {
  state: () => {
    return {
        list: []
    }
  },
  getters: {

  },
    actions: {
      // 添加数据
        add(id: number, time: string): void {
            this.list.push({
                id: this.list.length,
                updateTime: time,
                src: window.location.host + `/page/${id}`
            })
        }
  }
})