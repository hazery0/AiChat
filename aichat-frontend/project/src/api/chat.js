import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

export const chatApi = {
  getChatRoomList() {
    return axios.get(`${API_BASE_URL}/rooms`)
  },

  sendMessage(roomId, userPrompt) {
    return axios.post(`${API_BASE_URL}/${roomId}/chat`, null, {
      params: {
        userPrompt
      }
    })
  }
}
