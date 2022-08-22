import {useCanvasStore, useElementsStore} from "@/store"
import {
    ElCheckboxButton, ElCheckboxGroup,
    ElCollapse,
    ElCollapseItem,
    ElColorPicker,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber
} from "element-plus"
import {ref, defineComponent, watch} from "vue"
import type {Ref} from "vue"
import {computed} from "vue"
import type {CanvasStore, ElementsStore} from "@/interface"
import "./ConfigMenu.css"

export default defineComponent({
    setup() {

        let elements: ElementsStore = useElementsStore()
        let canvas: CanvasStore = useCanvasStore()
        // 折叠面板显示内容
        let configCollapse: Ref<string> = ref('baseConfig')
        let configCollapse1: Ref<string> = ref('baseConfig1')
        let configCollapse2: Ref<string> = ref('baseConfig2')
        // 当前选中的元素 id
        let focusId: Ref<number> = ref(0)

        // 当前选中的元素
        let currentFocus: Ref<string> = computed(() => {
            if (elements.focusElements.focus.length === 1) {
                let focus = elements.focusElements.focus[0]

                elements.elements.forEach((item, index) => {
                    if (item.id === focus.id) {
                        focusId.value = index
                        return
                    }
                })
                
                baseConfigMenu.general.title = `[${focus.key}]${focus.id}-样式`
                return 'general'
            } else {
                return 'canvas'
            }
        })

        // 各个组件单独设置
        //文本
        let currentFocusText: Ref<string> = computed(() => {
            if (elements.elements[focusId.value] && elements.elements[focusId.value].key === 'text') {
                return 'text'
            } else {
                return 'canvas'
            }
        })

        //按钮
        let currentFocusBtn: Ref<string> = computed(() => {
            if (elements.elements[focusId.value] && elements.elements[focusId.value].key === 'btn') {
                return 'btn'
            } else {
                return 'canvas'
            }
        })

        //输入框
        let currentFocusInput: Ref<string> = computed(() => {
            if (elements.elements[focusId.value] && elements.elements[focusId.value].key === 'input') {
                return 'input'
            } else {
                return 'canvas'
            }
        })

        // 图片
        let currentFocusImage: Ref<string> = computed(() => {
            if (elements.elements[focusId.value] && elements.elements[focusId.value].key === 'image') {
                return 'image'
            } else {
                return 'canvas'
            }
        })

        //视频
        let currentFocusVideo: Ref<string> = computed(() => {
            if (elements.elements[focusId.value] && elements.elements[focusId.value].key === 'video') {
                return 'video'
            } else {
                return 'canvas'
            }
        })

        //线段
        let currentFocusLine: Ref<string> = computed(() => {
            if (elements.elements[focusId.value] && elements.elements[focusId.value].key === 'line') {
                return 'line'
            } else {
                return 'canvas'
            }
        })

        //自定义事件
        let currentFocusEvent: Ref<string> = computed(() => {
            if (elements.elements[focusId.value]) {
                return 'event'
            } else {
                return 'canvas'
            }
        })

        // 表单更新
        const update = (value) => {

        }

        // 基础属性配置表单
        const baseConfigMenu = {
            canvas: {
                title: '画布样式',
                form:
                    <ElForm label-position="left" label-width="100px" model={canvas} style="max-width: 100%">
                        <ElFormItem label="画布背景">
                            <ElColorPicker v-model={canvas.bgColor}/>
                        </ElFormItem>
                        <ElFormItem label="画布宽度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={canvas.width}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="画布高度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={canvas.height}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="缩放比例">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={canvas.zoom}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>%</span>
                            </div>
                        </ElFormItem>
                    </ElForm>
            },
            general: {
                title: '',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="X坐标">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].left}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="Y坐标">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].top}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="控件宽度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].width}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="控件高度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].height}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="叠放层级">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].zIndex}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                            </div>
                        </ElFormItem>
                    </ElForm>
            },
            text: {
                title: '文本属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="文本内容">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                                type="textarea"
                                onChange={update}
                            />
                        </ElFormItem>
                        <ElFormItem label="字号">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].fontSize}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="字体">
                            <ElInput
                                v-model={elements.elements[focusId.value].fontFamily}
                                onChange={update}
                            />
                        </ElFormItem>
                        <ElFormItem label="字体颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].color}/>
                        </ElFormItem>
                        <ElFormItem label="背景颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].background}/>
                        </ElFormItem>
                    </ElForm>
            },
            btn: {
                title: '按钮属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="按钮内容">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                                onChange={update}
                            />
                        </ElFormItem>
                        <ElFormItem label="字体">
                            <ElInput
                                v-model={elements.elements[focusId.value].fontFamily}
                                onChange={update}
                            />
                        </ElFormItem>
                        <ElFormItem label="边框半径">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].borderRadius}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="字体颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].color}/>
                        </ElFormItem>
                    </ElForm>
            },
            input: {
                title: '输入框属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="提示信息">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                                type="textarea"
                                onChange={update}
                            />
                        </ElFormItem>
                        <ElFormItem label="类型 Type">
                            <ElInput
                                v-model={elements.elements[focusId.value].inputType}
                                onChange={update}
                            >
                            </ElInput>
                        </ElFormItem>
                        <ElFormItem label="边框半径">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].borderRadius}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                    </ElForm>,
            },
            image: {
                title: '图片属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="图片地址">
                            <ElInput
                                v-model={elements.elements[focusId.value].img}
                                type="textarea"
                                onChange={update}
                            />
                        </ElFormItem>
                        <ElFormItem label="边框半径">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].borderRadius}
                                    controlsPosition='right'
                                    precision={0}
                                    onChange={update}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                    </ElForm>,
            },
            video: {
                title: '视频属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="视频地址">
                            <ElInput
                                v-model={elements.elements[focusId.value].video}
                                type="textarea"
                                onChange={update}
                            />
                        </ElFormItem>
                        <ElFormItem label="播放设置" size="small">
                                <ElCheckboxButton v-model={elements.elements[focusId.value].autoplay} label="自动" checked></ElCheckboxButton>
                                <ElCheckboxButton v-model={elements.elements[focusId.value].loop} label="循环" checked></ElCheckboxButton>
                                <ElCheckboxButton v-model={elements.elements[focusId.value].muted} label="静音" checked></ElCheckboxButton>
                        </ElFormItem>
                    </ElForm>,
            },
            line: {
                title: '线段属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].background}/>
                        </ElFormItem>
                    </ElForm>,
            },
            event: {
                title: '自定义事件',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="事件">
                            <ElInput></ElInput>
                        </ElFormItem>
                    </ElForm>,
            },
        }


        return () => (
            <div>
                {/*基础样式*/}
                <div class="config-box">
                    <ElCollapse v-model={configCollapse.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocus.value].title}</h4>}}
                            name="baseConfig"
                        >
                            {baseConfigMenu[currentFocus.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                {/*文本*/}
                <div class="config-box"
                     v-show={elements.elements[focusId.value] && elements.elements[focusId.value].key === "text" && elements.focusElements.focus.length === 1}>
                    <ElCollapse v-model={configCollapse1.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusText.value].title}</h4>}}
                            name="baseConfig1"
                        >
                            {baseConfigMenu[currentFocusText.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                {/*按钮*/}
                <div class="config-box"
                     v-show={elements.elements[focusId.value] && elements.elements[focusId.value].key === "btn" && elements.focusElements.focus.length === 1}>
                    <ElCollapse v-model={configCollapse1.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusBtn.value].title}</h4>}}
                            name="baseConfig1"
                        >
                            {baseConfigMenu[currentFocusBtn.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                {/*输入框*/}
                <div class="config-box"
                     v-show={elements.elements[focusId.value] && elements.elements[focusId.value].key === "input" && elements.focusElements.focus.length === 1}>
                    <ElCollapse v-model={configCollapse1.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusInput.value].title}</h4>}}
                            name="baseConfig1"
                        >
                            {baseConfigMenu[currentFocusInput.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                {/*图片*/}
                <div class="config-box"
                     v-show={elements.elements[focusId.value] && elements.elements[focusId.value].key === "image" && elements.focusElements.focus.length === 1}>
                    <ElCollapse v-model={configCollapse1.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusImage.value].title}</h4>}}
                            name="baseConfig1"
                        >
                            {baseConfigMenu[currentFocusImage.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                {/*视频*/}
                <div class="config-box"
                     v-show={elements.elements[focusId.value] && elements.elements[focusId.value].key === "video" && elements.focusElements.focus.length === 1}>
                    <ElCollapse v-model={configCollapse1.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusVideo.value].title}</h4>}}
                            name="baseConfig1"
                        >
                            {baseConfigMenu[currentFocusVideo.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                {/*线段*/}
                <div class="config-box"
                     v-show={elements.elements[focusId.value] && elements.elements[focusId.value].key === "line" && elements.focusElements.focus.length === 1}>
                    <ElCollapse v-model={configCollapse1.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusLine.value].title}</h4>}}
                            name="baseConfig1"
                        >
                            {baseConfigMenu[currentFocusLine.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
                {/*自定义事件*/}
                <div class="config-box"
                v-show={elements.elements[focusId.value] && elements.focusElements.focus.length === 1}
                >
                    <ElCollapse v-model={configCollapse2.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusEvent.value].title}</h4>}}
                            name="baseConfig2"
                        >
                            {baseConfigMenu[currentFocusEvent.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
            </div>
        )
    }
})