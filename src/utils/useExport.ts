import editCanvasStyle from '@/components/EditCanvas/EditCanvas.css'
import baseStyle from '@/assets/css/base.css'
import $ from "jquery"

// 获取代码
export function getCode(selector: string): string {
    let html: string = $(selector).prop("outerHTML")
    html = html.replace(/>/g, ">\n        ")

    return `
<!DOCTYPE html>
<html lang="">
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="referrer" content="no-referrer">
    <title></title>
    <style type="text/css">
        ${editCanvasStyle + baseStyle}
    </style>
    </head>
    <body>
        ${html}
    </body>
</html>
`
}

// 下载代码
export function downloadCode(content: string):void {
    // 创建a标签
    let down = document.createElement('a')
    let blob = new Blob([content])
    down.download = 'index.html'

    // 给创建的 a 标签添加 href 属性并赋值
    down.href = URL.createObjectURL(blob)

    // 开始下载
    down.click()

    // 不再使用时需释放createObjectURL创建得对象
    URL.revokeObjectURL(blob.toString())
}