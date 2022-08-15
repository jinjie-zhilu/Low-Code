import type { App } from "vue"
import { createPinia } from "pinia"
import { createPersistedState } from "pinia-persistedstate-plugin"
import { canvasStore } from "./canvas"
import { elementsStore } from "./elements";

const store = createPinia()
store.use(createPersistedState())

export function setupStore(app: App<Element>) {
    app.use(store)
}

export {
    store,
    canvasStore,
    elementsStore
}
