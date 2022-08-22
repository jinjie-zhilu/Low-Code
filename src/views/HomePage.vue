<template>
    <div class="main">
        <el-container>
            <!-- 顶部工具栏 -->
            <el-header class="topbar">
                <el-button-group>
                    <el-button :disabled="state.current < 0" title="撤销" @click="undo"><i class="iconfont icon-undo"></i>
                    </el-button>
                    <el-button :disabled="state.current > state.stack.length - 2" title="重做" @click="redo"><i
                            class="iconfont icon-redo"></i>
                    </el-button>
                    <el-button title="删除组件" @click="deleteElement"><i class="iconfont icon-delete"></i>
                    </el-button>
                    <el-button title="清空画布" @click="clearCanvas"><i class="iconfont icon-clear"></i>
                    </el-button>
                </el-button-group>
                <div class="divider"></div>
                <el-button-group>
                    <el-button>组合</el-button>
                    <el-button>拆分</el-button>
                    <el-button>锁定</el-button>
                    <el-button>解锁</el-button>
                </el-button-group>
                <div class="divider"></div>
                <el-button-group>
                    <el-button @click="helpDialog =true">帮助</el-button>
                    <el-button @click="previewDialog =true">预览</el-button>
                    <el-button @click="getShots">截图</el-button>
                    <el-button @click="exportCode">导出</el-button>
                </el-button-group>
                <div class="divider"></div>
                <el-radio-group v-model="themeSelector" size="small" fill="#ecf5ff" @change="toggleDark()">
                    <el-radio-button title="白昼模式" label=false><i class="iconfont icon-light"></i></el-radio-button>
                    <el-radio-button title="黑夜模式" label=true><i class="iconfont icon-dark"></i></el-radio-button>
                </el-radio-group>
            </el-header>
            <el-container>
                <!-- 左侧组件列表 -->
                <el-aside class="leftmenu">
                    <ComponentList></ComponentList>
                </el-aside>
                <el-container>
                    <!-- 画布 -->
                    <el-main class="canvas-box">
                        <el-scrollbar class="canvas-block">
                            <EditCanvas state="edit"></EditCanvas>
                        </el-scrollbar>
                    </el-main>
                </el-container>
                <!-- 右侧属性表单 -->
                <el-aside class="rightmenu">
                    <ConfigMenu></ConfigMenu>
                </el-aside>
            </el-container>
        </el-container>
        <el-dialog custom-class="preview-dialog" v-model="previewDialog" width="80%" top="calc(4vh + 20px)">
            <template #header="{ titleId }">
                <span class="el-dialog__title" :id="titleId">预览窗口</span>
                <i title="全屏预览" class="iconfont icon-fullscreen" @click="fullScreen"></i>
            </template>
            <el-scrollbar class="canvas-block flex-center">
                <EditCanvas class="preview_canvas" id="preview_canvas" state="preview"></EditCanvas>
            </el-scrollbar>
        </el-dialog>
        <el-dialog custom-class="help-dialog" v-model="helpDialog" title="操作帮助" width="540px">
            <div class="help-box">
                <p v-for="(item, index) in shortcuts" :key="index">
                    <el-tag>{{item.key}}</el-tag>: {{item.content}}
                </p>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ComponentInternalInstance, getCurrentInstance, reactive, Ref, ref, WritableComputedRef } from 'vue'
import { useElementsStore } from '@/store'
import { useDark, useToggle } from '@vueuse/core'
import { screenshots } from '@/utils/screenshots'
import { ComponentList, EditCanvas, ConfigMenu } from '@/components'
import { registerCommand } from '@/utils/registerCommand'
import type { ElementItem, ElementsStore, State } from "@/interface"
import emitter from '@/utils/bus'
import { log } from 'console'
import { getCode, downloadCode } from '@/utils/useExport'

// 获取画布元素列表
let elements: ElementsStore = useElementsStore()

// 获取操作命令
let state: State = reactive(registerCommand(elements))

// 快捷键列表
let shortcuts: Array<{ [key: string]: string }> = [{
        key: 'Ctrl',
        content: '按住后可以进行多选元素'
    }, {
        key: 'Ctrl + A',
        content: '全选'
    }, {
        key: 'Ctrl + Z',
        content: '撤销操作'
    }, {
        key: 'Ctrl + Y',
        content: '重做操作'
    }, {
        key: 'Delete',
        content: '删除选中元素'
    }, {
        key: 'Ctrl + Delete',
        content: '清空画布'
    }
]

// 撤回/重做
let { undo, redo, deleteElement, clearCanvas } = state.commands

// 显示预览窗口
let previewDialog: Ref<boolean> = ref(false)

// 显示帮助窗口
let helpDialog: Ref<boolean> = ref(false)

// 黑夜模式
const isDark: WritableComputedRef<boolean> = useDark()
const toggleDark: (value?: boolean) => boolean = useToggle(isDark)

// 主题切换
let themeSelector: Ref<boolean> = ref(isDark.value)

// 更新状态
const updateState: () => void = () => {
    state.current++
    state.current--
}
emitter.on('updateState', updateState)

// 截图
const getShots: () => void = () => {
    previewDialog.value = true
    setTimeout(() => {
        const preview_canvas: HTMLElement = document.getElementById('preview_canvas')
        screenshots(preview_canvas)
    }, 500)
}

// 导出代码
const exportCode: () => void = () => {
    previewDialog.value = true
    setTimeout(() => {
        downloadCode(getCode('.preview_canvas'))
    }, 500)
}

// 全屏预览
const fullScreen: () => void = () => {
    window.open('/#/preview')
}

</script>

<style lang="scss" scoped>
.main {
    background-color: var(--el-bg-color);
}

.topbar {
    width: 100%;
    height: 8vh;
    min-height: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color);

    .el-radio-button.is-active i {
        color: #409eff;
        transition: 0.3s;
    }
}

.divider {
    margin: 0 20px;
    width: 1px;
    height: 80%;
    background-color: var(--el-border-color);
}

.leftmenu {
    width: 200px;
    height: 92vh;
    padding: 20px 10px;
}

.canvas-box {
    width: calc(100% - 500px);
    background-color: var(--el-fill-color-light);

    .canvas-block {
        width: 100%;
        height: calc(92vh - 40px);
    }
}

.rightmenu {
    width: 300px;
    height: 92vh;
    padding: 20px;
}

.preview-dialog {
    .iconfont {
        font-size: 18px;
        margin-left: 10px;
        cursor: pointer;

        &:hover {
            color: #409eff;
        }
    }
}

.help-dialog {
    p {
        height: 40px;
        .el-tag {
            margin-right: 10px;
        }
    }
}
</style>