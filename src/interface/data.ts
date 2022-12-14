// 函数
export type VoidF = () => void

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
    height: number
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
    fontFamily: string,
    color: string,
    img: string,
    video: string,
    inputType: string,
    background: string,
    borderRadius: number,
    muted: boolean,
    autoplay: boolean,
    loop: boolean,
    render?: Function,
    zoom?: number,
    revolve?: number,
    event?: string,
    value?: string
}

// 发布页面数据
export interface PublishData {
    id: number,
    updateTime: string,
    src: string
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
    execute(): {
        redo: VoidF,
        undo?: VoidF
    }
}

// 命令注册表
export interface State {
    current: number,
    stack: Array<{
        undo: Function,
        redo: Function
    }>,
    commands: {
        [key : string]: Command
    },
    commandArray: Array<Command>,
    destroyArray: Array<Function>
}