<template>
  <div class="page-enter">
    <div class="page-header">
      <h1>文章</h1>
      <p>记录思考、技术与生活</p>
    </div>
    <div class="post-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script setup>
import { posts } from '../data/posts.js'
import PostCard from '../components/PostCard.vue'
</script>
