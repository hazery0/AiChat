<template>
  <div class="home-page">
    <div class="content">
      <h1 class="title">AI 脑筋急转弯</h1>
      <a-button
        type="primary"
        size="large"
        class="start-button"
        @click="startGame"
      >
        开始游戏
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startGame = () => {
  const roomId = Math.floor(Math.random() * 1000000)
  router.push(`/chat/${roomId}`)
}
</script>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 400px;
}

.title {
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 60px;
  letter-spacing: 4px;
}

.start-button {
  padding: 12px 60px;
  height: auto;
  font-size: 24px;
  border-radius: 50px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .content {
    min-width: auto;
    width: 90%;
    padding: 40px 20px;
  }

  .title {
    font-size: 32px;
    margin-bottom: 40px;
  }

  .start-button {
    font-size: 20px;
    padding: 10px 40px;
  }
}
</style>
