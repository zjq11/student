<template>
  <div class="gallery-page page-enter">
    <!-- Password Gate -->
    <div v-if="!authenticated" class="password-gate">
      <div class="gate-card">
        <div class="gate-icon">&#x1F512;</div>
        <h2>此相册已加密</h2>
        <p class="gate-sub">请输入密码后查看</p>
        <form @submit.prevent="handleLogin">
          <input v-model="passwordInput" type="password" placeholder="请输入密码" class="pw-input" autofocus />
          <p v-if="error" class="gate-error">{{ error }}</p>
          <button type="submit" class="gate-btn">解 锁</button>
        </form>
      </div>
    </div>

    <!-- Gallery -->
    <div v-else class="gallery-root" @mousemove="showUI" @mouseleave="hideUIDelayed">
      <!-- Blurred Background -->
      <div v-if="currentPhoto" class="blur-bg" :style="{ backgroundImage: 'url(' + currentPhoto.dataUrl + ')' }"></div>

      <div class="gallery-inner">
        <!-- Top Bar -->
        <transition name="ui-fade">
          <div v-if="uiVisible" class="top-bar">
            <div class="top-left">
              <span class="top-title">&#x1F4F7; 相册</span>
              <span class="top-count">{{ currentIndex + 1 }} / {{ photos.length }}</span>
            </div>
            <div class="top-right">
              <button class="top-btn" @click="toggleGrid" :title="gridMode ? '幻灯片模式' : '网格模式'">
                {{ gridMode ? '&#x1F4C1;' : '&#x1F5BC;' }}
              </button>
              <label class="top-btn play-toggle">
                <input type="checkbox" v-model="autoPlay" />
                {{ autoPlay ? '&#x23F8;' : '&#x25B6;' }}
              </label>
              <router-link to="/" class="top-btn close-btn" title="关闭">&#x2716;</router-link>
            </div>
          </div>
        </transition>

        <!-- Grid Mode -->
        <div v-if="gridMode" class="grid-view">
          <div v-for="(photo, idx) in photos" :key="photo.id" class="grid-item" @click="selectPhoto(idx)">
            <img :src="photo.dataUrl" :alt="photo.name" class="grid-img" />
            <div class="grid-overlay">
              <span class="grid-name">{{ photo.name }}</span>
            </div>
          </div>
        </div>

        <!-- Slideshow Mode -->
        <div v-else class="slide-view">
          <!-- Progress Bar -->
          <div class="progress-track" v-if="autoPlay">
            <div class="progress-bar" :key="currentPhoto.id"></div>
          </div>

          <!-- Image -->
          <div class="image-wrapper">
            <Transition name="kenburns" mode="out-in">
              <img v-if="currentPhoto" :src="currentPhoto.dataUrl" :key="currentPhoto.id" class="main-img" :alt="currentPhoto.name" />
            </Transition>
          </div>

          <!-- Info Overlay -->
          <transition name="ui-fade">
            <div v-if="uiVisible" class="info-overlay">
              <div class="info-content">
                <h3 class="photo-title">{{ currentPhoto.name }}</h3>
                <span class="photo-date">{{ currentPhoto.date }}</span>
              </div>
            </div>
          </transition>

          <!-- Nav Buttons -->
          <transition name="ui-fade">
            <div v-if="uiVisible" class="nav-buttons">
              <button class="arrow-btn left" @click="prevPhoto">&#x2039;</button>
              <button class="arrow-btn right" @click="nextPhoto">&#x203A;</button>
            </div>
          </transition>

          <!-- Empty State -->
          <div v-if="photos.length === 0" class="empty-state">
            <div class="empty-icon">&#x1F4F8;</div>
            <p>还没有照片</p>
            <router-link to="/admin" class="upload-link">去上传照片</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getAllPhotos, isAuthenticated, setAuthenticated, verifyPassword } from '../utils/gallery.js'

const authenticated = ref(isAuthenticated())
const passwordInput = ref('')
const error = ref('')
const photos = ref([])
const currentIndex = ref(0)
const autoPlay = ref(true)
const uiVisible = ref(true)
const gridMode = ref(false)
let timer = null
let uiTimer = null

const currentPhoto = computed(() => {
  if (photos.value.length === 0) return null
  return photos.value[currentIndex.value % photos.value.length]
})

function showUI() {
  uiVisible.value = true
  clearTimeout(uiTimer)
}
function hideUIDelayed() {
  clearTimeout(uiTimer)
  uiTimer = setTimeout(() => { uiVisible.value = false }, 2500)
}

function handleLogin() {
  if (!passwordInput.value) { error.value = '请输入密码'; return }
  if (verifyPassword(passwordInput.value)) {
    authenticated.value = true; setAuthenticated(true); error.value = '';
    passwordInput.value = ''
  } else { error.value = '密码错误，请重试' }
}

function prevPhoto() {
  currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
  showUI()
}
function nextPhoto() {
  currentIndex.value = (currentIndex.value + 1) % photos.value.length;
  showUI()
}
function selectPhoto(idx) { currentIndex.value = idx; gridMode.value = false }

function toggleGrid() { gridMode.value = !gridMode.value }

function randomPhoto() {
  if (photos.value.length <= 1) return
  let next; do { next = Math.floor(Math.random() * photos.value.length) } while (next === currentIndex.value)
  currentIndex.value = next
}

function startAutoPlay() { stopAutoPlay(); timer = setInterval(randomPhoto, 4000) }
function stopAutoPlay() { if (timer) { clearInterval(timer); timer = null } }

function onKeyDown(e) {
  if (gridMode.value) return
  if (e.key === 'ArrowLeft') prevPhoto()
  else if (e.key === 'ArrowRight') nextPhoto()
  else if (e.key === ' ') { e.preventDefault(); autoPlay.value = !autoPlay.value }
  else if (e.key === 'Escape') gridMode.value = false
}

watch(autoPlay, (val) => { if (val) startAutoPlay(); else stopAutoPlay() })

onMounted(async () => {
  photos.value = await getAllPhotos()
  if (photos.value.length > 0) { currentIndex.value = Math.floor(Math.random() * photos.value.length) }
  if (autoPlay.value) startAutoPlay()
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  stopAutoPlay(); window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
/* === Layout === */
.gallery-page {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === Password Gate === */
.password-gate {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.gate-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.gate-icon { font-size: 3rem; margin-bottom: 12px; }
.gate-card h2 { color: #fff; font-size: 1.3rem; margin-bottom: 6px; }
.gate-sub { color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-bottom: 28px; }
.pw-input {
  width: 100%; padding: 14px 18px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: #fff; font-size: 1rem; outline: none;
  transition: border-color 0.3s;
}
.pw-input:focus { border-color: rgba(255,255,255,0.4); }
.pw-input::placeholder { color: rgba(255,255,255,0.3); }
.gate-error { color: #e74c3c; font-size: 0.85rem; margin-top: 8px; }
.gate-btn {
  margin-top: 16px; width: 100%; padding: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px; background: rgba(255,255,255,0.1);
  color: #fff; font-size: 1rem; cursor: pointer;
  transition: background 0.3s; letter-spacing: 4px;
}
.gate-btn:hover { background: rgba(255,255,255,0.2); }

/* === Gallery Root === */
.gallery-root {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #0a0a0a;
  overflow: hidden;
}

/* === Blur Background === */
.blur-bg {
  position: absolute;
  top: -60px; left: -60px; right: -60px; bottom: -60px;
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.25);
  transition: background-image 0.8s ease;
}

/* === Gallery Inner === */
.gallery-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* === Top Bar === */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
}
.top-left { display: flex; align-items: center; gap: 16px; }
.top-title { color: #fff; font-weight: 600; font-size: 0.95rem; }
.top-count { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
.top-right { display: flex; align-items: center; gap: 8px; }
.top-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: rgba(255,255,255,0.8);
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}
.top-btn:hover { background: rgba(255,255,255,0.2); }
.close-btn { text-decoration: none; }
.play-toggle { cursor: pointer; }
.play-toggle input { display: none; }

/* === Slideshow === */
.slide-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.main-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}

/* === Progress Bar === */
.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.1);
  z-index: 10;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #e74c3c, #c0392b);
  animation: progress 4s linear forwards;
}
@keyframes progress {
  from { width: 0% }
  to { width: 100% }
}

/* === Info Overlay === */
.info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 32px 24px;
  background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%);
}
.info-content { display: flex; flex-direction: column; gap: 4px; }
.photo-title { color: #fff; font-size: 1.1rem; font-weight: 600; margin: 0; }
.photo-date { color: rgba(255,255,255,0.5); font-size: 0.85rem; }

/* === Nav Buttons === */
.arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.3);
  border: none;
  color: #fff;
  font-size: 3rem;
  width: 60px;
  height: 100px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  line-height: 1;
  backdrop-filter: blur(4px);
}
.arrow-btn:hover { background: rgba(0,0,0,0.5); transform: translateY(-50%) scale(1.05); }
.arrow-btn.left { left: 0; border-radius: 0 12px 12px 0; }
.arrow-btn.right { right: 0; border-radius: 12px 0 0 12px; }

/* === Grid View === */
.grid-view {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  align-content: start;
}
.grid-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  transition: transform 0.3s;
}
.grid-item:hover { transform: scale(1.03); }
.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.grid-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  opacity: 0;
  transition: opacity 0.3s;
}
.grid-item:hover .grid-overlay { opacity: 1; }
.grid-name { color: #fff; font-size: 0.8rem; }

/* === Empty State === */
.empty-state {
  text-align: center;
  color: rgba(255,255,255,0.6);
}
.empty-icon { font-size: 4rem; margin-bottom: 12px; }
.upload-link {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 28px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: #fff;
  text-decoration: none;
  transition: background 0.3s;
}
.upload-link:hover { background: rgba(255,255,255,0.2); }

/* === Transitions === */
.ui-fade-enter-active, .ui-fade-leave-active { transition: opacity 0.4s ease; }
.ui-fade-enter-from, .ui-fade-leave-to { opacity: 0; }

.kenburns-enter-active {
  animation: kenIn 0.8s ease-out;
}
.kenburns-leave-active {
  animation: kenOut 0.8s ease-in;
}
@keyframes kenIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes kenOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(1.05); }
}

/* === Responsive === */
@media (max-width: 640px) {
  .arrow-btn { width: 40px; height: 70px; font-size: 2rem; }
  .grid-view { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; padding: 12px; }
  .photo-title { font-size: 0.95rem; }
  .top-bar { padding: 12px 16px; }
  .slide-view { padding: 8px; }
}
</style>
