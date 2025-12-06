package com.hazergu.aichat.service;

import com.hazergu.aichat.model.ChatRoom;

import java.util.List;

public interface ChatService {
    //通过房间号，与特定用户对话
    String doChat(Long roomId, String userPrompt);

    //获取当前的所有聊天房间对话
    List<ChatRoom> getChatRooms();
}
