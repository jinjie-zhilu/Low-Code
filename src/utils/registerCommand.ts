import { ElMessage, ElMessageBox } from "element-plus"
import { onUnmounted } from "vue"
import emitter from "./bus"
import { deepcopy } from "./deepcopy"
import type { Command, ElementItem, State } from "@/interface"

export function registerCommand(elements) {
    const state: State = {
        current: -1,    // 操作索引
        stack: [],      // 操作队列
        commands: {
            undo: null,
            redo: null,
            action: null
        },   // 操作命令-执行函数映射表
        commandArray: [],   // 操作命令列表
        destroyArray: []
    }

    const registry: (command: Command) => void = (command: Command) => {
        state.commandArray.push(command)
        // @ts-ignore
        state.commands[command.key] = () => {
            const { redo, undo } = command.execute()
            
            redo()
            if (!command.pushStack) {
                return
            }
            let { stack, current } = state

            if (stack.length > 0) {
                stack = stack.slice(0, current + 1)
                state.stack = stack
            }

            stack.push({ redo, undo })
            state.current = current + 1
            emitter.emit('updateState')
        }
    }

    // 重做命令
    registry({
        key: 'redo',
        keyboard: 'ctrl+y',
        execute() {
            return {
                redo() {
                    let item: { undo: Function, redo: Function } = state.stack[state.current + 1]
                    if (item) {
                        item.redo && item.redo()
                        state.current++
                        ElMessage.success('重做成功')
                        emitter.emit('updateState')
                    } else {
                        ElMessage.error('没有可重做的操作')
                    }
                }
            }
        }
    })

    // 撤销命令
    registry({
        key: 'undo',
        keyboard: 'ctrl+z',
        execute() {
            return {
                redo() {
                    if (state.current < 0) {
                        ElMessage.error('没有可撤销的操作')
                        return
                    }
                    let item: { undo: Function, redo: Function } = state.stack[state.current]
                    if (item) {
                        item.undo && item.undo()
                        state.current--
                        ElMessage.success('撤销成功')
                        emitter.emit('updateState')
                    } else {
                        ElMessage.error('没有可撤销的操作')
                    }
                }
            }
        }
    })

    // 删除命令
    registry({
        key: 'deleteElement',
        keyboard: 'Delete',
        execute() {
            return {
                redo() {
                    // 获取删除元素
                    let deleteElements: Array<ElementItem> = deepcopy(elements.focusElements.focus)
                    let elementsList: string = ''
                    deleteElements.forEach((item) => {
                        elementsList += `[${item.key}]-${item.id} `
                    })

                    // 提示
                    ElMessageBox.confirm(
                        `将删除元素: { ${elementsList}}，是否继续?`,
                        '警告',
                        {
                            confirmButtonText: '确认删除',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    ).then(() => {
                        // 发布删除开始事件
                        emitter.emit('actionStart')

                        // 删除
                        elements.delete(deleteElements)
                        ElMessage({
                            type: 'success',
                            message: '删除成功',
                        })

                        // 发布删除结束事件
                        emitter.emit('actionEnd')
                    })
                    .catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '取消删除',
                        })
                    })
                }
            }
        }
    })

    // 清空命令
    registry({
        key: 'clearCanvas',
        keyboard: 'ctrl+Delete',
        execute() {
            return {
                redo() {
                    ElMessageBox.confirm(
                        '将清空画布中的所有元素，是否继续?',
                        '警告',
                        {
                            confirmButtonText: '确认删除',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    ).then(() => {
                        // 发布删除开始事件
                        emitter.emit('actionStart')

                        // 删除
                        elements.clearAll()
                        ElMessage({
                            type: 'success',
                            message: '删除成功',
                        })

                        // 发布删除结束事件
                        emitter.emit('actionEnd')
                    })
                    .catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '取消删除',
                        })
                    })
                }
            }
        }
    })

    // action 操作
    registry({
        key: 'action',
        pushStack: true,
        init() {
            this.before = null
            // action 开始，保存事件
            const start: () => void = () => {
                this.before = deepcopy(elements.elements)
            }
            const end: () => void = () => {
                // @ts-ignore
                state.commands.action()
            }
            emitter.on('actionStart', start)
            emitter.on('actionEnd', end)
            return () => {
                emitter.off('actionStart', start)
                emitter.off('actionEnd', end)
            }
        },
        execute() {
            let before: Array<ElementItem> = this.before
            let after: Array<ElementItem> = deepcopy(elements.elements)

            return {
                redo() {
                    elements.set(after)
                },
                undo() {
                    elements.set(before)
                }
            }
        }
    })
        
    // 注册快捷键
    const keyboardEvent = (() => {
        const onKeydown = (e: KeyboardEvent) => {
            const { ctrlKey, key } = e
            let keyString: string = ctrlKey ? `ctrl+${key}` : key
            
            if (keyString) {
                state.commandArray.forEach(({ keyboard, key }) => {
                    if (keyboard === keyString) {
                        // @ts-ignore
                        state.commands[key]()
                        e.preventDefault()
                    }
               })
            }
        }
        const init = () => {
            // 初始化
            window.addEventListener('keydown', onKeydown)
            return () => {
                // 销毁
                window.removeEventListener('keydown', onKeydown)
            }
        }
        return init
    })()

    ;(() => {
        state.destroyArray.push(keyboardEvent())
        state.commandArray.forEach((command) => {
            command.init && state.destroyArray.push(command.init())
        })
    })()

    // 卸载事件
    onUnmounted(() => {
        state.destroyArray.forEach((fn) => {
            fn && fn()
        })
    })

    return state
}