import { Command, ElementItem, State } from "@/interface/data"
import { storeToRefs } from "pinia"
import { start } from "repl"
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
            drag: null
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
                    }
                }
            }
        }
    })

    registry({
        key: 'undo',
        keyboard: 'ctrl+z',
        execute() {
            return {
                redo() {
                    if (state.current < 0) {
                        return
                    }
                    let item: { undo: Function, redo: Function } = state.stack[state.current]
                    if (item) {
                        item.undo && item.undo()
                        state.current--
                    }
                }
            }
        }
    })

    registry({
        key: 'drag',
        pushStack: true,
        init() {
            this.before = null
            // 开始拖拽，保存事件
            const start: () => void = () => {
                this.before = deepcopy(elements.elements)
            }
            const end: () => void = () => {
                state.commands.drag()
            }
            emitter.on('dragstart', start)
            emitter.on('dragend', end)
            return () => {
                emitter.off('dragstart', start)
                emitter.off('dragend', end)
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

    ;(() => {
        state.commandArray.forEach((command) => {
            command.init && state.destroyArray.push(command.init())
        })
    })()

    onUnmounted(() => {
        state.destroyArray.forEach((fn) => {
            fn && fn()
        })
    })

    return state
}