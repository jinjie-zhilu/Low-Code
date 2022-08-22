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
    fontFamily: "",
    color: "#333",
    background: "",
    render: (data) => <p style={{
        textAlign: 'center',
        lineHeight: `${data.height}px`,
        fontFamily: `${data.fontFamily}`,
        background: `${data.background}`,
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
    fontFamily: "",
    color: "#606266",
    borderRadius: 5,
    render: (data) => <button style={{
        width: '100%', height: '100%',
        fontFamily: `${data.fontFamily}`,
        borderRadius: `${data.borderRadius}px`,
    }} class='el-buttons'>{data.label}</button>
})

registry.register({
    key: 'input',
    label: '输入框',
    focus: false,
    width: 180,
    height: 32,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    inputType: "",
    borderRadius: 5,
    render: (data) => <input style={{
        lineHeight: `${data.height}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
        borderRadius: `${data.borderRadius}px`,
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
    borderRadius: 0,
    img: "https://www.pics.fineyh.com/images/2022/08/20/202208201641833.png",
    render: (data) => <img src={data.img}
                           style={{
                               width: `${data.width}px`,
                               height: `${data.height}px`,
                               borderRadius: `${data.borderRadius}px`,
                           }}></img>
})

registry.register({
    key: 'video',
    label: '视频',
    focus: false,
    width: 145,
    height: 108,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    video: "https://www.w3schools.com/html/movie.mp4",
    autoplay: true,
    loop: true,
    muted: true,
    render: (data) => <video src={data.video}
                             autoplay={data.autoplay} loop={data.loop} muted={data.muted}
                             style={{
                                 width: `${data.width}px`,
                                 height: `${data.height}px`
                             }}></video>
})

registry.register({
    key: 'line',
    label: '线段',
    focus: false,
    width: 400,
    height: 1,
    zIndex: 0,
    background: "#333",
    render: (data) => <hr style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        background: `${data.background}`,
    }}></hr>
})