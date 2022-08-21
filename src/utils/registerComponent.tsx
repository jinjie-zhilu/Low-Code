import { ElButton } from 'element-plus'
import { ComponentRegisty } from '@/interface'

// 创建映射函数
function registerComponent(): ComponentRegisty {
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
export let registry: ComponentRegisty = registerComponent()

// 注册组件
registry.register({
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

registry.register({
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

registry.register({
    key: 'wenbenkuang',
    label: '输入框',
    focus: false,
    width: 180,
    height: 32,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    inputType: "",
    render: (data) => <input style={{
        lineHeight: `${data.height}px`,
        width: `${data.width}px`,
        height: `${data.height}px`
    }} placeholder={data.label} type={data.inputType}></input>
})

registry.register({
    key: 'image',
    label: '图片',
    focus: false,
    width: 192,
    height: 108,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    img: "https://www.pics.fineyh.com/images/2022/08/20/202208201641833.png",
    render: (data) => <img src={data.img}
                           style={{
                               width: `${data.width}px`,
                               height: `${data.height}px`
    }}></img>
})

registry.register({
    key: 'video-o',
    label: '视频',
    focus: false,
    width: 192,
    height: 108,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    video: "https://www.w3schools.com/html/movie.mp4",
    render: (data) => <video src={data.video}
                           style={{
                               width: `${data.width}px`,
                               height: `${data.height}px`
                           }}></video>
})