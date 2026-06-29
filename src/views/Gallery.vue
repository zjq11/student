<template>
  <div class="gallery-page page-enter">
    <div v-if="!authenticated" class="password-gate">
      <div class="lock-icon">🔒</div>
      <h2>相册已加密</h2>
      <p class="gate-hint">请输入密码查看照片</p>
      <form @submit.prevent="handleLogin">
        <input v-model="passwordInput" type="password" placeholder="请输入密码" class="password-input" autofocus />
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn-primary">解锁</button>
      </form>
    </div>

    <div v-else class="gallery-view">
      <div v-if="loading" class="loading-state">
        <p>加载中...</p>
      </div>
      <div v-else-if="photos.length === 0" class="empty-state">
        <div class="empty-icon">📷</div>
        <p>还没有照片</p>
        <router-link to="/admin" class="btn-primary">去上传照片</router-link>
      </div>

      <div v-else class="slideshow-container">
        <Transition name="fade" mode="out-in">
          <img :src="currentPhoto.dataUrl" :key="currentPhoto.id" class="slide-img" :alt="currentPhoto.name" />
        </Transition>
        <div class="slide-info">
          <span class="slide-name">{{ currentPhoto.name }}</span>
          <span class="slide-date">{{ currentPhoto.date }}</span>
        </div>
        <button class="nav-btn nav-prev" @click="prevPhoto">&#8249;</button>
        <button class="nav-btn nav-next" @click="nextPhoto">&#8250;</button>
        <div class="slide-footer">
          <span class="slide-counter">{{ currentIndex + 1 }} / {{ photos.length }}</span>
          <label class="auto-play-toggle">
            <input type="checkbox" v-model="autoPlay" /> 自动播放
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  getAllPhotos, isAuthenticated, setAuthenticated, verifyPassword
} from '../utils/gallery.js'

const authenticated = ref(isAuthenticated())
const passwordInput = ref('')
const error = ref('')
const photos = ref([])
const currentIndex = ref(0)
const autoPlay = ref(true)
const loading = ref(true)
let timer = null

const currentPhoto = computed(() => {
  if (photos.value.length === 0) return null
  return photos.value[currentIndex.value % photos.value.length]
})

function handleLogin() {
  if (!passwordInput.value) { error.value = '\u8BF7\u8F93\u5165\u5BC6\u7801'; return }
  if (verifyPassword(passwordInput.value)) {
    authenticated.value = true; setAuthenticated(true); error.value = ''; passwordInput.value = ''
  } else {
    error.value = '\u5BC6\u7801\u9519\u8BEF\uFF0C\u8BF7\u91CD\u8BD5'
  }
}

function prevPhoto() {
  currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length
}
function nextPhoto() {
  currentIndex.value = (currentIndex.value + 1) % photos.value.length
}
function randomPhoto() {
  if (photos.value.length <= 1) return
  let next; do { next = Math.floor(Math.random() * photos.value.length) } while (next === currentIndex.value)
  currentIndex.value = next
}
function startAutoPlay() { stopAutoPlay(); timer = setInterval(randomPhoto, 3500) }
function stopAutoPlay() { if (timer) { clearInterval(timer); timer = null } }

watch(autoPlay, (val) => { if (val) startAutoPlay(); else stopAutoPlay() })

onMounted(async () => {
  photos.value = await getAllPhotos()
  loading.value = false
  if (photos.value.length > 0) {
    currentIndex.value = Math.floor(Math.random() * photos.value.length)
  }
  if (autoPlay.value) startAutoPlay()
})
onUnmounted(stopAutoPlay)
</script>

<style scoped>
.gallery-page { min-height: calc(100vh - 140px); display: flex; align-items: center; justify-content: center; }
.password-gate { text-align: center; padding: 48px 32px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); max-width: 400px; width: 100%; }
.lock-icon { font-size: 3rem; margin-bottom: 16px; }
.password-gate h2 { margin-bottom: 8px; font-size: 1.4rem; }
.gate-hint { color: var(--text-muted); margin-bottom: 24px; }
.password-input { width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; font-size: 1rem; background: var(--bg); color: var(--text); outline: none; transition: border-color 0.2s; }
.password-input:focus { border-color: var(--accent); }
.error-msg { color: var(--accent); font-size: 0.9rem; margin-top: 8px; }
.btn-primary { display: inline-block; margin-top: 16px; padding: 10px 32px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.9; }
.gallery-view { width: 100%; max-width: 900px; }
.loading-state, .empty-state { text-align: center; padding: 80px 32px; }
.empty-icon { font-size: 4rem; margin-bottom: 16px; }
.slideshow-container { position: relative; width: 100%; aspect-ratio: 4/3; background: var(--code-bg); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); box-shadow: var(--shadow-hover); }
.slide-img { width: 100%; height: 100%; object-fit: contain; display: block; }
.slide-info { position: absolute; bottom: 56px; left: 0; right: 0; padding: 12px 24px; background: linear-gradient(transparent, rgba(0,0,0,0.6)); color: #fff; display: flex; justify-content: space-between; font-size: 0.9rem; }
.nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.3); color: #fff; border: none; font-size: 2.5rem; width: 50px; height: 80px; cursor: pointer; transition: background 0.2s; line-height: 1; }
.nav-btn:hover { background: rgba(0,0,0,0.6); }
.nav-prev { left: 0; border-radius: 0 var(--radius) var(--radius) 0; }
.nav-next { right: 0; border-radius: var(--radius) 0 0 var(--radius); }
.slide-footer { position: absolute; top: 16px; right: 16px; display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.4); color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; }
.auto-play-toggle { display: flex; align-items: center; gap: 4px; cursor: pointer; }
.auto-play-toggle input { cursor: pointer; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
