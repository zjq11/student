<template>
  <div class="page-enter" v-if="post">
    <article>
      <div class="article-header">
        <router-link class="back-link" to="/">← 返回文章列表</router-link>
        <h1>{{ post.title }}</h1>
        <div class="article-meta">
          <span>{{ post.date }}</span>
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="article-content" v-html="renderedContent"></div>
    </article>
  </div>
  <div v-else class="page-enter">
    <p>文章未找到</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts.js'
import { marked } from 'marked'

const route = useRoute()
const post = posts.find(p => p.id === route.params.id)

const renderedContent = computed(() => {
  if (!post) return ''
  return marked(post.content)
})
</script>
