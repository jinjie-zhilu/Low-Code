import { createRouter, createWebHistory } from 'vue-router'

const routes: Array<any> = [{
        path: '/',
        component: () => import('../views/HomePage.vue'),
    }, {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }, {
        path: '/preview',
        component: () => import('../views/PreviewPage.vue'),
    }, {
        path: '/page/:id',
        component: () => import('../views/PreviewPage.vue'),
    }
]

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})