<template>
  <div>
    <NavBar />
    <main class="container" id="mainContent">
      <router-view />
    </main>
    <footer class="footer">
      <p>&copy; 2026 我的博客 &middot; 用 ❤️ 书写</p>
    </footer>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
:root {
  --bg: #faf8f5;
  --bg-card: #ffffff;
  --bg-hover: #f5f2ed;
  --text: #2c2c2c;
  --text-secondary: #6b6b6b;
  --text-muted: #9a9a9a;
  --border: #e8e4de;
  --accent: #c0392b;
  --accent-soft: #fdf2f0;
  --code-bg: #f4f1eb;
  --shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.08);
  --radius: 10px;
  --max-w: 720px;
  --max-w-wide: 960px;
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: "SF Mono", "Fira Code", "Consolas", monospace;
}

[data-theme="dark"] {
  --bg: #1a1a1e;
  --bg-card: #242428;
  --bg-hover: #2e2e34;
  --text: #e4e4e7;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --border: #333338;
  --accent: #e74c3c;
  --accent-soft: #2c1518;
  --code-bg: #2e2e34;
  --shadow: 0 1px 3px rgba(0,0,0,0.2);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.3);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  transition: background 0.3s, color 0.3s;
  min-height: 100vh;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover {
  opacity: 0.8;
}

/* Navigation */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  background: rgba(250, 248, 245, 0.85);
  transition: background 0.3s, border-color 0.3s;
}

[data-theme="dark"] .nav {
  background: rgba(26, 26, 30, 0.85);
}

.nav-inner {
  max-width: var(--max-w-wide);
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
}

.nav-brand span {
  color: var(--accent);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  list-style: none;
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  padding: 4px 0;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.25s;
}

.nav-links a:hover::after,
.nav-links a.router-link-exact-active::after {
  width: 100%;
}

.nav-links a.router-link-exact-active {
  color: var(--text);
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1;
  transition: background 0.2s, color 0.2s;
  margin-left: 8px;
}

.theme-toggle:hover {
  background: var(--bg-hover);
  color: var(--text);
}

.container {
  max-width: var(--max-w-wide);
  margin: 0 auto;
  padding: 48px 24px 80px;
}

/* Page Header */
.page-header {
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1.05rem;
}

/* Post List */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 32px;
  cursor: pointer;
  transition: box-shadow 0.25s, transform 0.25s, background 0.3s, border-color 0.3s;
  box-shadow: var(--shadow);
}

.post-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
  border-color: var(--accent);
}

.post-card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.post-card-tags {
  display: flex;
  gap: 6px;
}

.post-card-tags span {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 1px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 500;
}

.post-card h2 {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.35;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.post-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.post-card:hover h2 {
  color: var(--accent);
}

/* Article */
.article-header {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.article-header .back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.article-header .back-link:hover {
  color: var(--accent);
}

.article-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin-bottom: 12px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.article-meta .tags {
  display: flex;
  gap: 6px;
}

.article-meta .tags span {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 1px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 500;
}

.article-content {
  font-size: 1.05rem;
  line-height: 1.85;
  color: var(--text);
}

.article-content h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 36px 0 16px;
  letter-spacing: -0.01em;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.article-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 28px 0 12px;
}

.article-content p {
  margin-bottom: 20px;
}

.article-content a {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-content ul,
.article-content ol {
  margin: 0 0 20px 24px;
}

.article-content li {
  margin-bottom: 6px;
}

.article-content blockquote {
  border-left: 3px solid var(--accent);
  background: var(--accent-soft);
  padding: 16px 20px;
  margin: 24px 0;
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--text-secondary);
  font-style: italic;
}

.article-content blockquote p:last-child {
  margin-bottom: 0;
}

.article-content code {
  font-family: var(--font-mono);
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.article-content pre {
  background: var(--code-bg);
  border-radius: var(--radius);
  padding: 20px 24px;
  overflow-x: auto;
  margin: 24px 0;
  border: 1px solid var(--border);
}

.article-content pre code {
  background: none;
  padding: 0;
  font-size: 0.88rem;
  line-height: 1.6;
}

.article-content img {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 24px 0;
  border: 1px solid var(--border);
}

.article-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 36px 0;
}

.about-content {
  font-size: 1.05rem;
  line-height: 1.85;
}

.about-content p {
  margin-bottom: 20px;
}

.about-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 36px 0 16px;
}

.footer {
  border-top: 1px solid var(--border);
  padding: 32px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.page-enter {
  animation: fadeUp 0.35s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .nav-inner {
    padding: 0 16px;
  }

  .container {
    padding: 28px 16px 60px;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .post-card {
    padding: 20px 24px;
  }

  .post-card h2 {
    font-size: 1.15rem;
  }

  .article-header h1 {
    font-size: 1.6rem;
  }

  .article-content {
    font-size: 1rem;
  }
}
</style>
