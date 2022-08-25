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
                    <el-button @click="helpDialog = true">帮助</el-button>
                    <el-button @click="previewDialog = true">预览</el-button>
                    <el-button @click="getShots">截图</el-button>
                </el-button-group>
                <div class="divider"></div>
                <el-button-group>
                    <el-button @click="exportCode">导出</el-button>
                    <el-button @click="showPublishDialog">发布</el-button>
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
                            <EditCanvas></EditCanvas>
                        </el-scrollbar>
                    </el-main>
                </el-container>
                <!-- 右侧属性表单 -->
                <el-aside class="rightmenu">
                    <ConfigMenu></ConfigMenu>
                    <h5 style="vertical-align: inherit;">直接编辑代码</h5><br/>

                    <span class="codeedit">
                        <el-button @click="codeEditor=true">写代码</el-button>
                    </span>
                </el-aside>
            </el-container>
        </el-container>
        <!-- 预览对话框 -->
        <el-dialog custom-class="preview-dialog" v-model="previewDialog" width="80%" top="calc(4vh + 20px)">
            <template #header="{ titleId }">
                <span class="el-dialog__title" :id="titleId">预览窗口</span>
                <i title="全屏预览" class="iconfont icon-fullscreen" @click="fullScreen"></i>
            </template>
            <el-scrollbar class="canvas-block flex-center">
                <ShowCanvas class="preview_canvas" id="preview_canvas" :data="{canvas, elements: elements.elements}"></ShowCanvas>
            </el-scrollbar>
        </el-dialog>

         <!-- 写代码区域 -->
        <el-dialog v-model="codeEditor" class="e-code">
            <template #header="{ titleId }"><span :id="titleId">代码详情</span></template>
            <el-scrollbar class="canvas-block flex-center">
                <CodeMirror></CodeMirror>
            </el-scrollbar>

        </el-dialog>

        <!-- 帮助对话框 -->
        <el-dialog custom-class="help-dialog" v-model="helpDialog" title="操作帮助" width="540px">
            <div class="help-box">
                <p v-for="(item, index) in shortcuts" :key="index">
                    <el-tag>{{item.key}}</el-tag>: {{item.content}}
                </p>
            </div>
        </el-dialog>
        <!-- 发布项目对话框 -->
        <el-dialog custom-class="publish-dialog" v-model="publishDialog" title="发布项目" width="620px">
            <el-table v-if="publishPages.list.length" :data=" publishPages.list" style="width: 100%"
                @row-click="selectPage">
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="updateTime" label="发布时间" width="150" show-overflow-tooltip />
                <el-table-column prop="src" label="链接" width="240" show-overflow-tooltip>
                    <template #default="scope">
                        <a target="_blank" :href="scope.row.src">{{scope.row.src}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="src" label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="copyUrl(scope.row.src)">复制地址</el-button>
                        <el-popconfirm confirm-button-text="删除" cancel-button-text="取消" :icon="InfoFilled"
                            icon-color="#626AEF" title="确定要删除这个已发布页面吗?" @confirm="deletePage(scope.row.id)"
                            @cancel="deletePage(-1)">
                            <template #reference>
                                <el-button link type="danger" size="small">删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <h4 v-else>分享你的作品，让更多人看到！</h4>
            <el-input v-model="publishUrl" readonly>
                <template v-if="!isNewPublish" #prepend>
                    <el-button @click="getUrl">重置</el-button>
                </template>
                <template #append>
                    <el-button type="primary" :icon="Upload" @click="submitPublish">
                        {{isNewPublish ? '发布当前页面' : '保存到该页面'}}
                    </el-button>
                </template>
            </el-input>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, Ref, ref, WritableComputedRef } from 'vue'
import { useElementsStore, usePublishStore, useCanvasStore } from '@/store'
import { useDark, useToggle } from '@vueuse/core'
import { screenshots } from '@/utils/screenshots'
import { ComponentList, EditCanvas, ConfigMenu, ShowCanvas } from '@/components'
import { registerCommand } from '@/utils/registerCommand'
import type { CanvasStore, ElementsStore, PublishStore, State } from "@/interface"
import emitter from '@/utils/bus'
import { Upload, InfoFilled } from "@element-plus/icons-vue"
import { getCode, downloadCode } from '@/utils/useExport'
import { deleteRequest, getRequest, postRequest, putRequest } from '@/http'
import { ElMessage, ElMessageBox } from 'element-plus'
import CodeMirror from './CodeMirror.vue'

// 获取画布元素列表
let elements: ElementsStore = useElementsStore()
let canvas: CanvasStore = useCanvasStore()

// 获取操作命令
let state: State = reactive(registerCommand(elements))

// 获取发布数据
let publishPages: PublishStore = usePublishStore()

// 是否为新发布页面
let isNewPublish: Ref<boolean> = ref(true)

// 发布网址
let publishId: Ref<number> = ref(-1)
let publishUrl: Ref<string> = computed(() => {
    return `http://${window.location.host}/page/${publishId.value}`
})

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

//写代码
let codeEditor: Ref<boolean> = ref(false)

// 显示帮助窗口
let helpDialog: Ref<boolean> = ref(false)

// 显示发布窗口
let publishDialog: Ref<boolean> = ref(false)

// 黑夜模式
const isDark: WritableComputedRef<boolean> = useDark()
const toggleDark: (value?: boolean) => boolean = useToggle(isDark)

// 主题切换
let themeSelector: Ref<boolean> = ref(isDark.value)

// 初始化发布页面列表
publishPages.init()

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

// 获取发布网址
const getUrl: () => void = () => {
    if (publishPages.list.length) {
        publishId.value = publishPages.list[0].id + 1
    } else {
        publishId.value = 1
    }
    isNewPublish.value = true
}

// 打开发布对话框
const showPublishDialog: () => void = () => {
    if (publishId.value < 0) {
        getUrl()
    }
    publishPages.init()
    publishDialog.value = true
}

// 选中某一行
const selectPage: Function = (row: any) => {
    publishId.value = row.id
    isNewPublish.value = false
}

// 复制网址
const copyUrl: (url: string) => void = (url: string) => {
    navigator.clipboard.writeText(url)    
    ElMessage({
        type: 'success',
        message: '复制成功',
    })
}

// 删除页面
const deletePage: (id: number) => void = (id: number) => {
    if (id > 0) {
        deleteRequest(id, (res) => {
            publishPages.delete(id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        })
    } else {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    }
}

// 发布页面
const submitPublish: () => void = () => {
    if (publishPages.list.length && publishPages.have(publishUrl.value)) {
        putRequest(publishId.value, {
            elements: elements.elements,
            canvas: canvas
        }, (res) => {
            ElMessage({
                type: 'success',
                message: '发布成功',
            })
            publishPages.init()
        })
    } else {
        postRequest({
            elements: elements.elements,
            canvas: canvas
        }, (res) => {
            ElMessage({
                type: 'success',
                message: '发布成功',
            })
            isNewPublish.value = false
            publishPages.init()
        })
    }
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
.publish-dialog .el-dialog__body {
    padding-top: 20px !important;
    .el-input {
        margin-top: 20px;
    }
}
</style>