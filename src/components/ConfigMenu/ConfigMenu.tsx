import { useCanvasStore } from "@/store";
import { ElCollapse, ElCollapseItem, ElColorPicker, ElForm, ElFormItem, ElInput } from "element-plus";
import { ref, defineComponent } from "vue";
import type { Ref } from "vue";

export default defineComponent({
    setup() {

        let configCollapse: Ref<string> = ref('baseConfig')
        let canvas = useCanvasStore()

        return () => (
            <div class="config-box">
                <ElCollapse v-model={configCollapse.value} accordion>
                    <ElCollapseItem
                        v-slots={{ title: () => <h4>画布背景</h4> }}
                        name="baseConfig"
                    >
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
                    </ElCollapseItem>
                </ElCollapse>
            </div>
        )
    }
})