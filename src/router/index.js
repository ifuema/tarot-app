import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Cardpool from '../views/Cardpool.vue'
import My from '../views/My.vue'
import House from '../views/House.vue'
import Lottery from '../views/Lottery.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        component: Login,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/cardpool',
        component: Cardpool,
    },
    {
        path: '/my',
        component: My,
    },
    {
        path: '/house',
        component: House,
    },
    {
        path: '/lottery/:userid/:activityid',
        component: Lottery,
    },
]

let router = new Router({
    routes,
})

export default router