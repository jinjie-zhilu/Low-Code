import { ElButton } from 'element-plus'
import { ComponentInfo } from '../interface'

// 创建映射函数
function createMapping(): ComponentInfo {
    // 组件列表
    const componentList = []
    // 画布组件映射
    const componentMap = {}

    return {
        componentList,
        componentMap,
        register: (component) => {
            componentList.push(component)
            componentMap[component.key] = component
        }
    }
}

// 导出
export let registerComponent = createMapping()

// 注册组件
registerComponent.register({
    key: 'text',
    label: '文本',
    focus: false,
    width: 40,
    height: 22,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    render: (data) => <p style={{
        textAlign: 'center',
        lineHeight: `${data.height}px`
    }}>{data.label}</p>
})

registerComponent.register({
    key: 'btn',
    label: '按钮',
    focus: false,
    width: 60,
    height: 32,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    render: (data) => <ElButton>{ data.label }</ElButton>
})