<template>
  <div class="admin-page page-enter">
    <!-- Password Gate -->
    <div v-if="!authenticated" class="password-gate">
      <div class="lock-icon">🔒</div>
      <h2>管理后台已加密</h2>
      <p class="gate-hint">请输入密码进入管理后台</p>
      <form @submit.prevent="handleLogin">
        <input
          v-model="passwordInput"
          type="password"
          placeholder="请输入密码"
          class="password-input"
          autofocus
        />
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn-primary">进入</button>
      </form>
    </div>

    <!-- Admin Panel -->
    <div v-else>
      <div class="page-header">
        <h1>管理后台</h1>
      </div>

      <!-- Upload Section -->
      <section class="admin-section">
        <h2>上传照片</h2>
        <div class="upload-area" @click="fileInput.click()">
          <div class="upload-icon">📤</div>
          <p>点击选择照片</p>
          <p class="upload-hint">支持 JPG / PNG / WebP</p>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            style="display:none"
            @change="handleUpload"
          />
        </div>
        <p v-if="uploadMsg" class="upload-msg">{{ uploadMsg }}</p>
        <p v-if="storageWarning" class="storage-warning">{{ storageWarning }}</p>
      </section>

      <!-- Photo Grid -->
      <section class="admin-section" v-if="photos.length > 0">
        <h2>照片列表 ({{ photos.length }})</h2>
        <div class="photo-grid">
          <div v-for="photo in photos" :key="photo.id" class="photo-item">
            <img :src="photo.dataUrl" :alt="photo.name" class="photo-thumb" />
            <div class="photo-actions">
              <span class="photo-name">{{ photo.name }}</span>
              <button class="btn-delete" @click="handleDelete(photo.id)">删除</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Password Change -->
      <section class="admin-section">
        <h2>修改密码</h2>
        <form @submit.prevent="handlePasswordChange" class="password-form">
          <input
            v-model="passwordForm.current"
            type="password"
            placeholder="当前密码"
            class="password-input"
          />
          <input
            v-model="passwordForm.newPass"
            type="password"
            placeholder="新密码"
            class="password-input"
          />
          <input
            v-model="passwordForm.confirm"
            type="password"
            placeholder="确认新密码"
            class="password-input"
          />
          <p v-if="pwError" class="error-msg">{{ pwError }}</p>
          <p v-if="pwSuccess" class="success-msg">{{ pwSuccess }}</p>
          <button type="submit" class="btn-primary">修改密码</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  getStoredPhotos, isAuthenticated, setAuthenticated,
  verifyPassword, getPassword, setPassword,
  addPhoto, deletePhoto
} from '../utils/gallery.js'

const authenticated = ref(isAuthenticated())
const passwordInput = ref('')
const error = ref('')
const photos = ref(getStoredPhotos())
const fileInput = ref(null)
const uploadMsg = ref('')
const storageWarning = ref('')
const pwError = ref('')
const pwSuccess = ref('')

const passwordForm = reactive({
  current: '',
  newPass: '',
  confirm: ''
})

const MAX_STORAGE = 5 * 1024 * 1024 // 5MB

function handleLogin() {
  if (!passwordInput.value) {
    error.value = '请输入密码'
    return
  }
  if (verifyPassword(passwordInput.value)) {
    authenticated.value = true
    setAuthenticated(true)
    error.value = ''
    passwordInput.value = ''
  } else {
    error.value = '密码错误'
  }
}

function handleUpload(e) {
  const files = e.target.files
  if (!files.length) return
  uploadMsg.value = ''
  storageWarning.value = ''

  let currentSize = 0
  for (const p of photos.value) {
    currentSize += p.dataUrl.length
  }

  let uploaded = 0
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      if (currentSize + dataUrl.length > MAX_STORAGE) {
        storageWarning.value = '存储空间不足（上限约5MB），部分照片未上传'
        return
      }
      currentSize += dataUrl.length
      photos.value = addPhoto(dataUrl, file.name)
      uploaded++
      uploadMsg.value = `已上传 ${uploaded} 张照片`
    }
    reader.readAsDataURL(file)
  })
}

function handleDelete(id) {
  if (confirm('确定删除这张照片吗？')) {
    photos.value = deletePhoto(id)
  }
}

function handlePasswordChange() {
  pwError.value = ''
  pwSuccess.value = ''

  if (!verifyPassword(passwordForm.current)) {
    pwError.value = '当前密码错误'
    return
  }
  if (passwordForm.newPass.length < 4) {
    pwError.value = '新密码至少4位'
    return
  }
  if (passwordForm.newPass !== passwordForm.confirm) {
    pwError.value = '两次密码不一致'
    return
  }

  setPassword(passwordForm.newPass)
  passwordForm.current = ''
  passwordForm.newPass = ''
  passwordForm.confirm = ''
  pwSuccess.value = '密码修改成功！'
  setTimeout(() => { pwSuccess.value = '' }, 3000)
}

onMounted(() => {
  photos.value = getStoredPhotos()
})
</script>

<style scoped>
.admin-page {
  max-width: var(--max-w-wide);
  margin: 0 auto;
}

.password-gate {
  text-align: center;
  padding: 48px 32px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  max-width: 400px;
  margin: 60px auto;
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.password-gate h2 {
  margin-bottom: 8px;
  font-size: 1.4rem;
}

.gate-hint {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.password-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 12px;
}

.password-input:focus {
  border-color: var(--accent);
}

.error-msg {
  color: var(--accent);
  font-size: 0.9rem;
  margin: 4px 0;
}

.success-msg {
  color: #27ae60;
  font-size: 0.9rem;
  margin: 4px 0;
}

.btn-primary {
  padding: 10px 32px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.admin-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 32px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
}

.admin-section h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.upload-area:hover {
  border-color: var(--accent);
  background: var(--bg-hover);
}

.upload-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.upload-msg {
  color: var(--accent);
  margin-top: 8px;
  font-size: 0.9rem;
}

.storage-warning {
  color: #e67e22;
  margin-top: 8px;
  font-size: 0.9rem;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg);
}

.photo-thumb {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.photo-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
}

.photo-name {
  font-size: 0.8rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.btn-delete {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.btn-delete:hover {
  opacity: 0.85;
}

.password-form .password-input {
  max-width: 400px;
}

@media (max-width: 640px) {
  .admin-section {
    padding: 20px;
  }
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }
}
</style>
