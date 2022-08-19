<template>
    <div class="main">
        <el-container>
            <!-- 顶部工具栏 -->
            <el-header class="topbar">
                <el-button-group>
                    <el-button title="撤销" @click="undo"><i class="iconfont icon-undo"></i></el-button>
                    <el-button title="重做" @click="redo"><i class="iconfont icon-redo"></i></el-button>
                    <el-button title="插入图片"><i class="iconfont icon-img"></i></el-button>
                    <el-button title="清空画布" @click="clearCanvas"><i class="iconfont icon-clear"></i></el-button>
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
                    <el-button>预览</el-button>
                    <el-button>截图</el-button>
                    <el-button>导出</el-button>
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
                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref, WritableComputedRef } from 'vue'
import { useElementsStore } from '@/store'
import { useDark, useToggle } from '@vueuse/core'
import { ComponentList, EditCanvas, ConfigMenu } from '../components'
import { ElementsStore } from "@/interface"
import { ElMessage, ElMessageBox } from 'element-plus'
import { registerCommand } from '@/utils/registerCommand'

// 获取画布元素列表
let elements: ElementsStore = useElementsStore()

// 黑夜模式
const isDark: WritableComputedRef<boolean> = useDark()
const toggleDark: (value?: boolean) => boolean = useToggle(isDark)

// 主题切换
let themeSelector: Ref<boolean> = ref(isDark.value)

// 获取操作命令
let { undo, redo } = registerCommand(elements).commands

// 清空画布方法
const clearCanvas: () => void = () => {
    ElMessageBox.confirm(
        '将清空画布中的所有元素，是否继续?',
        '警告',
        {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        elements.clearAll()
    })
    .catch(() => {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    })
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
    padding: 20px 10px;
}
</style>