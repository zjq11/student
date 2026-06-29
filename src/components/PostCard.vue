<template>
  <div class="post-card" @click="$router.push({ name: 'Post', params: { id: post.id } })">
    <div class="post-card-meta">
      <span>{{ post.date }}</span>
      <div class="post-card-tags">
        <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
    <h2>{{ post.title }}</h2>
    <p>{{ post.excerpt }}</p>
  </div>
</template>

<script setup>
defineProps({
  post: { type: Object, required: true }
})
</script>
