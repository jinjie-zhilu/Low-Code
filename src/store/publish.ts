import { getRequest } from '@/http'
import { PublishStore } from '@/interface'
import { deepcopy } from '@/utils/deepcopy'
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
        // 初始化数据
        init(): void {
            this.list.splice(0, this.list.length)
            getRequest('?_sort=id&_order=desc', (res) => {
                res.forEach(element => {
                    this.add(element.id, element.updateTime)
                })
            })
            
        },
        // 添加数据
        add(id: number, time: string): void {
            this.list.push({
                id: id,
                updateTime: time,
                src: `http://${window.location.host}/page/${id}`
            })
        },
        // 判断 list 中是否存在该网址
        have(url: string): boolean {
            let sameUrl = this.list.filter(item => item.src === url)
            return sameUrl.length > 0
        },
        // 删除
        delete(id: number): void {
            let list = deepcopy(this.list)
            this.list.splice(0, this.list.length)
            list.forEach(item => {
                if (item.id != id) {
                    this.add(item.id, item.updateTime)
                }
            })
        }
  }
})