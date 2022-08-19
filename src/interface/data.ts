// 组件渲染数据
export interface ComponentData {
    key: string,
    top: number,
    left: number
}

// 画布属性
export interface Canvas {
    bgColor: string,
    width: number,
    height: number,
    zoom: number
}

// 组件元素属性
export interface ElementItem {
    id?: number,
    key: string,
    focus: boolean,
    label: string,
    top?: number,
    left?: number,
    width: number,
    height: number,
    zIndex: number,
    fontSize: number,
    color: string,
    render?: Function
}

// 编辑数据
export interface EditData {
    canvas: Canvas,
    elements: {
        elements: Array<ElementItem>
    }
}

// 坐标
export interface Pos {
    X: number,
    Y: number
}

// 组件信息注册表
export interface ComponentRegisty {
    componentList: Array<ElementItem>,
    componentMap: {
        [key: string]: ElementItem
    },
    register: Function
}

// 命令
export interface Command {
    key: string,
    keyboard?: string,
    pushStack?: boolean,
    init?: Function,
    execute: Function
}

// 命令注册表
export interface State {
    current: number,
    stack: Array<{
        undo: Function,
        redo: Function
    }>,
    commands: {
        undo: Command,
        redo: Command,
        action: Command
    },
    commandArray: Array<Command>,
    destroyArray: Array<Function>
}