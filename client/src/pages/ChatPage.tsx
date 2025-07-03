import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock chat users - in real app, fetch from API
  const chatUsers: ChatUser[] = [
    {
      id: '1',
      username: 'sarah_chen',
      displayName: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: '2',
      username: 'alex_dev',
      displayName: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isOnline: false,
      lastSeen: '2 jam yang lalu'
    },
    {
      id: '3',
      username: 'luna_photo',
      displayName: 'Luna Martinez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isOnline: true
    }
  ];

  // Mock messages - in real app, fetch from API
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: '1',
      content: 'Hai! Gimana kabarnya?',
      timestamp: '2025-07-03T10:30:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'current',
      content: 'Baik! Lagi ngapain?',
      timestamp: '2025-07-03T10:31:00Z',
      isRead: true
    },
    {
      id: '3',
      senderId: '1',
      content: 'Lagi kerja nih, project baru 😊',
      timestamp: '2025-07-03T10:32:00Z',
      isRead: false
    }
  ];

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current',
        content: newMessage,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const selectedUser = chatUsers.find(u => u.id === selectedChat);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {!selectedChat ? (
        // Chat List
        <div className="bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat</h1>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {chatUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedChat(user.id)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.displayName}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">10:32</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lagi kerja nih, project baru 😊</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.isOnline ? 'Online' : user.lastSeen}
                      </span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Chat Room
        <div className="flex flex-col h-screen">
          {/* Chat Header */}
          <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative">
                  <img
                    src={selectedUser?.avatar}
                    alt={selectedUser?.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedUser?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser?.displayName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser?.isOnline ? 'Online' : selectedUser?.lastSeen}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <Phone size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <Video size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'current'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === 'current' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pesan..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}