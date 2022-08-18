// 组件渲染数据
export interface ComponentData {
    key: string,
    top: number,
    left: number
}

// 组件信息表
export interface ComponentInfo {
    componentList: Array<ElementItem>,
    componentMap: {
        [key: string]: ElementItem
    },
    register: Function
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
    render: Function
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