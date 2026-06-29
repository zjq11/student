const STORAGE_KEYS = {
  PHOTOS: 'blog_gallery_photos',
  PASSWORD: 'blog_gallery_password',
  AUTH: 'blog_gallery_auth'
}

const DEFAULT_PASSWORD = 'photo2026'

export function getStoredPhotos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]')
  } catch {
    return []
  }
}

export function saveStoredPhotos(photos) {
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos))
}

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

export function addPhoto(dataUrl, fileName) {
  const photos = getStoredPhotos()
  photos.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    dataUrl,
    name: fileName || '\u672A\u547D\u540D',
    date: new Date().toISOString().slice(0, 10)
  })
  saveStoredPhotos(photos)
  return photos
}

export function deletePhoto(id) {
  const photos = getStoredPhotos().filter(p => p.id !== id)
  saveStoredPhotos(photos)
  return photos
}

export function verifyPassword(input) {
  return input === getPassword()
}
