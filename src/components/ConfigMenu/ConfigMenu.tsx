import {useCanvasStore, useElementsStore} from "@/store"
import {ElCollapse, ElCollapseItem, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber} from "element-plus"
import {ref, defineComponent, watch} from "vue"
import type {Ref} from "vue"
import {computed} from "vue"
import type {CanvasStore, ElementsStore} from "@/interface"
import emitter from "@/utils/bus"
import "./ConfigMenu.css"

export default defineComponent({
    setup() {

        let elements: ElementsStore = useElementsStore()
        let canvas: CanvasStore = useCanvasStore()
        // 折叠面板显示内容
        let configCollapse: Ref<string> = ref('baseConfig')
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

        // 个别组件单独设置
        // 图片
        let currentFocusImage: Ref<string> = computed(() => {
            if (elements.elements[focusId.value] && elements.elements[focusId.value].key === 'image') {
                return 'image'
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
                        <ElFormItem label="文本内容">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                                type="textarea"
                                onChange={update}
                            />
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
                        <ElFormItem label="字体颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].color}/>
                        </ElFormItem>
                    </ElForm>
            },
            image: {
                title: '图片设置',
                form:
                    <ElForm>
                        <ElFormItem label="输入图片地址">
                            <ElInput
                                v-model={elements.elements[focusId.value].img}
                                type="textarea"
                                onChange={update}
                            />
                            {/*<ElInput type="file" v-model={elements.elements[focusId.value].img}></ElInput>*/}
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

                {/*图片*/}
                <div class="config-box"
                     v-show={elements.elements[focusId.value] && elements.elements[focusId.value].key === "image" && elements.focusElements.focus.length === 1}>
                    <ElCollapse v-model={configCollapse.value} accordion>
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocusImage.value].title}</h4>}}
                            name="baseConfig1"
                        >
                            {baseConfigMenu[currentFocusImage.value].form}
                        </ElCollapseItem>
                    </ElCollapse>
                </div>
            </div>
        )
    }
})