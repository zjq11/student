import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import About from '../views/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/post/:id', name: 'Post', component: Post },
  { path: '/about', name: 'About', component: About }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
