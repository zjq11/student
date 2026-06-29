<template>
  <nav class="nav">
    <div class="nav-inner">
      <router-link class="nav-brand" to="/">我的<span>博客</span></router-link>
      <ul class="nav-links">
        <li><router-link to="/" exact>首页</router-link></li>
        <li><router-link to="/gallery">相册</router-link></li>
        <li><router-link to="/about">关于</router-link></li>
        <li><router-link to="/admin">管理</router-link></li>
        <li>
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色' : '切换到暗色'">
            {{ isDark ? '\u2600\uFE0F' : '\uD83C\uDF19' }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light'
  isDark.value = saved === 'dark'
  document.documentElement.setAttribute('data-theme', saved)
}

function toggleTheme() {
  isDark.value = !isDark.value
  const next = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
}

onMounted(initTheme)
</script>
