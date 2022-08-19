import { Command, ElementItem, State } from "@/interface/data"
import { ElMessage } from "element-plus"
import { onUnmounted, ref } from "vue"
import emitter from "./bus"
import { deepcopy } from "./deepcopy"

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
                    } else {
                        ElMessage.error('没有可撤销的操作')
                    }
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
        
    const keyboardEvent = (() => {
        const onKeydown = (e: KeyboardEvent) => {
            const { ctrlKey, key } = e
            let keyString: string = ctrlKey ? `ctrl+${key}` : ''
            if (keyString) {
                state.commandArray.forEach(({ keyboard, key }) => {
                    if (keyboard === keyString) {
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