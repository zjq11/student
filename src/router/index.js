import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import About from '../views/About.vue'
import Gallery from '../views/Gallery.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/post/:id', name: 'Post', component: Post },
  { path: '/about', name: 'About', component: About },
  { path: '/gallery', name: 'Gallery', component: Gallery },
  { path: '/admin', name: 'Admin', component: Admin }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
