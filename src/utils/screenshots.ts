import html2canvas from "html2canvas"
import { Canvas2Image } from '@/assets/canvas2image'

// 截图
export function screenshots(canvasRef) {
    // 准备新的 canvas
    let width: number = canvasRef.offsetWidth
    let height: number = canvasRef.offsetHeight
    let canvas: HTMLCanvasElement = document.createElement('canvas')

    // 缩放2倍
    let scale: number = 2
    canvas.width = width * scale
    canvas.height = height * scale
    canvas.getContext('2d').scale(scale, scale)

    // 配置参数
    let opts = {
        scale: 1,
        canvas: canvas,
        width: width,
        height: height,
        useCORS: false
    }
    html2canvas(canvasRef, opts).then(canvas => {
        // DOM 转为 canvas
        let context: CanvasRenderingContext2D = canvas.getContext('2d')

        // 关闭抗锯齿
        context.imageSmoothingEnabled = false
        // canvas 转为 <image>
        let img: HTMLElement = Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height)

        let dataURL: string = img.getAttribute('src')

        // 下载 <image>
        let down: HTMLAnchorElement = document.createElement('a')
        document.body.appendChild(down)
        down.href = dataURL

        // 设置下载标题
        down.download = "预览截图"
        down.click()
    })
}