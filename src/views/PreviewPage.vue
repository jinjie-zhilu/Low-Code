<template>
    <ShowCanvas v-if="loaded" :data="{canvas , elements}" />
</template>

<script lang="ts" setup>
import { EditCanvas, ShowCanvas } from '@/components'
import { getRequest } from '@/http'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { ref, Ref } from 'vue-demi'
import { Canvas, ElementItem } from '@/interface'
import { useCanvasStore, useElementsStore } from '@/store'

let router: RouteLocationNormalizedLoaded = useRoute()

let loaded: Ref<boolean> = ref(false)
let canvas: Ref<Canvas> = ref(null)
let elements: Ref<Array<ElementItem>> = ref(null)

if (router.params.id) {
    getRequest(`?id=${router.params.id}`, (res) => {
        if (!res.length) {
            location.href = '/notfound'
        }
        canvas.value = res[0].canvas
        elements.value = res[0].elements
        loaded.value = true
    })
} else {
    let canvasStore = useCanvasStore()
    let elementsStore = useElementsStore()
    canvas.value = canvasStore.$state as Canvas
    elements.value = elementsStore.elements
    loaded.value = true
}
</script>

<style lang="scss" scoped>

/* 隐藏滚动条 */
::-webkit-scrollbar {
    /* 滚动条整体样式 */
    display: none;
}
</style>