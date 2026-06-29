const STORAGE_KEYS = {
  PASSWORD: 'blog_gallery_password',
  AUTH: 'blog_gallery_auth'
}

const DEFAULT_PASSWORD = 'photo2026'

// === IndexedDB for photo storage ===
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('blog_gallery', 1)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getStoredPhotos() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readonly')
    const store = tx.objectStore('photos')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export async function addPhoto(dataUrl, fileName) {
  const db = await openDB()
  const photo = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    dataUrl,
    name: fileName || '\u672A\u547D\u540D',
    date: new Date().toISOString().slice(0, 10)
  }
  await new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite')
    const store = tx.objectStore('photos')
    store.add(photo)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  return photo
}

export async function deletePhoto(id) {
  const db = await openDB()
  await new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite')
    const store = tx.objectStore('photos')
    store.delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllPhotos() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readonly')
    const store = tx.objectStore('photos')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

// === localStorage for small data ===
export function getPassword() {
  return localStorage.getItem(STORAGE_KEYS.PASSWORD) || DEFAULT_PASSWORD
}

export function setPassword(newPassword) {
  localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword)
}

export function isAuthenticated() {
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true'
}

export function setAuthenticated(val) {
  localStorage.setItem(STORAGE_KEYS.AUTH, val ? 'true' : 'false')
}

export function verifyPassword(input) {
  return input === getPassword()
}
