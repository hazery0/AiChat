<template>
  <div class="chat-room">
    <div class="sidebar">
      <div class="sidebar-header">历史对话</div>
      <div class="room-list">
        <div
          v-for="room in roomList"
          :key="room.id"
          class="room-item"
          :class="{ active: room.id === currentRoomId }"
          @click="switchRoom(room.id)"
        >
          房间号: {{ room.roomId }}
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="chat-header">
        <h2>AI 脑筋急转弯</h2>
        <div class="room-info">房间号: {{ roomId }}</div>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-wrapper', message.role === 'ai' ? 'ai-message' : 'user-message']"
        >
          <div class="avatar">
            <img v-if="message.role === 'ai'" src="/ai-avatar.png" alt="AI" />
            <img v-else src="/user-avatar.png" alt="User" />
          </div>
          <div class="message-bubble">
            {{ message.content }}
          </div>
        </div>
      </div>

      <div class="chat-controls">
        <div class="control-buttons">
          <a-button
            type="primary"
            :disabled="gameStarted"
            @click="startGame"
          >
            开始游戏
          </a-button>
          <a-button
            danger
              :disabled="!gameStarted || gameEnded"
            @click="endGame"
          >
            结束游戏
          </a-button>
        </div>
        <div class="input-area">
          <a-input
            v-model:value="userInput"
            placeholder="请输入内容"
            :disabled="!gameStarted || gameEnded"
            @pressEnter="sendMessage"
            class="message-input"
          />
          <a-button
            type="primary"
            :disabled="!gameStarted || gameEnded || !userInput.trim()"
            @click="sendMessage"
            class="send-button"
          >
            发送
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { chatApi } from '../api/chat'
import { message as antMessage } from 'ant-design-vue'

const route = useRoute()
const roomId = ref(route.params.roomId)
const currentRoomId = ref(parseInt(roomId.value))
const messages = ref([])
const userInput = ref('')
const gameStarted = ref(false)
const gameEnded = ref(false)
       // 保证按钮互斥逻辑
       watch(gameStarted, (val) => {
         if (val) {
           gameEnded.value = false
         }
       })
       watch(gameEnded, (val) => {
         if (val) {
           gameStarted.value = false
         }
       })
const messagesContainer = ref(null)
const roomList = ref([])

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const startGame = async () => {
  try {
    const response = await chatApi.sendMessage(roomId.value, '开始')
    const aiReply = response.data

    messages.value.push({
      role: 'user',
      content: '开始'
    })
    messages.value.push({
      role: 'ai',
      content: aiReply
    })

    gameStarted.value = true
    scrollToBottom()

    if (aiReply.includes('游戏已结束')) {
      gameEnded.value = true
    }
  } catch (error) {
    console.error('Failed to start game:', error)
    antMessage.error('启动游戏失败，请检查后端服务是否运行')
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const messageText = userInput.value.trim()
  userInput.value = ''

  try {
    messages.value.push({
      role: 'user',
      content: messageText
    })
    scrollToBottom()

    const response = await chatApi.sendMessage(roomId.value, messageText)
    const aiReply = response.data

    messages.value.push({
      role: 'ai',
      content: aiReply
    })
    scrollToBottom()

    if (aiReply.includes('游戏已结束')) {
      gameEnded.value = true
    }
  } catch (error) {
    console.error('Failed to send message:', error)
    antMessage.error('发送消息失败')
  }
}

const endGame = async () => {
  try {
    const response = await chatApi.sendMessage(roomId.value, '结束')
    const aiReply = response.data

    messages.value.push({
      role: 'user',
      content: '结束'
    })
    messages.value.push({
      role: 'ai',
      content: aiReply
    })

    gameEnded.value = true
    scrollToBottom()
  } catch (error) {
    console.error('Failed to end game:', error)
    antMessage.error('结束游戏失败')
  }
}

const loadRoomList = async () => {
  try {
    const response = await chatApi.getChatRoomList()
    console.log('Room list response:', response.data)
    roomList.value = response.data || []
  } catch (error) {
    console.error('Failed to load room list:', error)
  }
}

const switchRoom = (id) => {
  window.location.href = `/chat/${id}`
}

onMounted(() => {
  loadRoomList()
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.chat-room {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.room-list {
  flex: 1;
  overflow-y: auto;
}

.room-item {
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.room-item:hover {
  background: #f5f5f5;
}

.room-item.active {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  padding: 20px 30px;
  border-bottom: 1px solid #e8e8e8;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chat-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #333;
}

.room-info {
  color: #666;
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background: #fafafa;
}

.message-wrapper {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
  gap: 12px;
}

.ai-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
  text-align: right;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-message .avatar {
  order: 1;
}

.ai-message .message-bubble {
  order: 2;
  background: white;
  color: #333;
  border: 1px solid #e8e8e8;
  border-radius: 12px 12px 12px 4px;
}

.user-message .avatar {
  order: 2;
}

.user-message .message-bubble {
  order: 1;
  background: #1890ff;
  color: white;
  border-radius: 12px 12px 4px 12px;
}

.message-bubble {
  max-width: 60%;
  padding: 12px 18px;
  border-radius: 12px;
  line-height: 1.6;
  word-wrap: break-word;
}

.chat-controls {
  padding: 20px 30px;
  border-top: 1px solid #e8e8e8;
  background: white;
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input-area {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  height: 45px;
  border-radius: 22px;
  padding: 0 20px;
}

.send-button {
  height: 45px;
  padding: 0 30px;
  border-radius: 22px;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .chat-messages {
    padding: 15px;
  }

  .message-bubble {
    max-width: 75%;
  }

  .chat-controls {
    padding: 15px;
  }

  .control-buttons {
    flex-wrap: wrap;
  }
}
</style>