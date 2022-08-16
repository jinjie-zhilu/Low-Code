import { useCanvasStore, useElementsStore } from "@/store";
import { ElCollapse, ElCollapseItem, ElColorPicker, ElForm, ElFormItem, ElInput } from "element-plus";
import { ref, defineComponent } from "vue";
import type { Ref } from "vue";
import { computed } from "vue";

export default defineComponent({
    setup() {

        let elements = useElementsStore()
        let canvas = useCanvasStore()
        // 折叠面板显示内容
        let configCollapse: Ref<string> = ref('baseConfig')
        // 当前选中的元素 id
        let focusId: Ref<number> = ref(0)
        // 当前选中的元素
        let currentFocus: Ref<string> = computed(() => {
            if (elements.focusElements.length === 1) {
                let focus = elements.focusElements[0]
                focusId.value = focus.id
                baseConfigMenu.general.title = `[${focus.key}]${focus.label}-样式`
                return 'general'
            } else {
                return 'canvas'
            }
        })
        
        const baseConfigMenu = {
            canvas: {
                title: '画布样式',
                form:
                    <ElForm label-position="left" label-width="100px" model={canvas} style="max-width: 100%">
                        <ElFormItem label="画布背景">
                            <ElColorPicker v-model={canvas.bgColor} />
                        </ElFormItem>
                        <ElFormItem label="画布宽度">
                            <ElInput
                                v-model={canvas.width}
                                v-slots={{ suffix: () => 'px' }}
                            />
                        </ElFormItem>
                        <ElFormItem label="画布高度">
                            <ElInput
                                v-model={canvas.height}
                                v-slots={{ suffix: () => 'px' }}
                            />
                        </ElFormItem>
                        <ElFormItem label="缩放比例">
                            <ElInput
                                v-model={canvas.zoom}
                                v-slots={{ suffix: () => '%' }}
                            />
                        </ElFormItem>
                    </ElForm>
            },
            general: {
                title: '',
                form:
                    <ElForm label-position="left" label-width="100px" model={elements.elements[focusId.value]} style="max-width: 100%">
                        <ElFormItem label="X坐标">
                            <ElInput
                                v-model={elements.elements[focusId.value].left}
                                v-slots={{ suffix: () => 'px' }}
                            />
                        </ElFormItem>
                        <ElFormItem label="Y坐标">
                            <ElInput
                                v-model={elements.elements[focusId.value].top}
                                v-slots={{ suffix: () => 'px' }}
                            />
                        </ElFormItem>
                        <ElFormItem label="文本内容">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                                type="textarea"
                            />
                        </ElFormItem>
                        <ElFormItem label="控件宽度">
                            <ElInput
                                v-model={elements.elements[focusId.value].width}
                                v-slots={{ suffix: () => 'px' }}
                            />
                        </ElFormItem>
                        <ElFormItem label="控件高度">
                            <ElInput
                                v-model={elements.elements[focusId.value].height}
                                v-slots={{ suffix: () => 'px' }}
                            />
                        </ElFormItem>
                        <ElFormItem label="叠放层级">
                            <ElInput
                                v-model={elements.elements[focusId.value].zIndex}
                            />
                        </ElFormItem>
                        <ElFormItem label="字号">
                            <ElInput
                                v-model={elements.elements[focusId.value].fontSize}
                                v-slots={{ suffix: () => 'px' }}
                            />
                        </ElFormItem>
                        <ElFormItem label="element">
                            <ElColorPicker v-model={elements.elements[focusId.value].color} />
                        </ElFormItem>
                    </ElForm>
            }
        }

        return () => (
            <div class="config-box">
                <ElCollapse v-model={configCollapse.value} accordion>
                    <ElCollapseItem
                        v-slots={{ title: () => <h4>{baseConfigMenu[currentFocus.value].title }</h4> }}
                        name="baseConfig"
                    >
                        {baseConfigMenu[currentFocus.value].form}
                    </ElCollapseItem>
                </ElCollapse>
            </div>
        )
    }
})